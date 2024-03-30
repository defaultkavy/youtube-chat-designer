import { $, $Button, $Select, $Textarea } from 'fluentx';
import { StylePanel } from './structure/StylePanel';
import { StyleModel } from './structure/StyleModel';
import { defaultStyle } from './data/defaultStyle';
import { YouTubeChat } from './structure/YouTubeChat';
import { $Input } from 'fluentx/lib/$Input';
import { ColorInput } from './component/ColorInput';
import { ytchat_css } from './data/ytchat';

export const ROLE_MODEL_MAP = new Map<string, Map<string, StyleModel>>();
const ROLE_LIST = ['Normal', 'Member', 'Moderator', 'Owner'];
const ELEMENT_LIST = ['Message', 'Name', 'Badge', 'Avatar', 'Author Area', 'Content Area', 'Outer Area'];
const IS_TEXT_ELEMENT = ['Message', 'Name', 'Timestamp'];
const IS_IMAGE_ELEMENT = ['Badge', 'Avatar'];
const PANEL_MAP = new Map<string, StylePanel>();

const $view = $('view');
export const $chat = new YouTubeChat().css({backgroundColor: '#131313'})
  .send({name: 'Normal User', message: 'Hover mouse on the message will show the author role info.', role: 'Normal'})
  .send({name: 'Member User', message: 'You can use Shift + Left Click on Role list to select multiple role!', role: 'Member'})
  .send({name: 'Moderator User', message: 'yoyo', role: 'Moderator'})
  .send({name: 'Owner User', message: 'Using the input panel to send message for testing.', role: 'Owner'})

init();
function init() {
  ROLE_MODEL_MAP.clear();
  for (const role of ROLE_LIST) {
    const STYLE_MAP = new Map<string, StyleModel>()
    ROLE_MODEL_MAP.set(role, STYLE_MAP)
    for (const element of ELEMENT_LIST) {
      const model = new StyleModel(defaultStyle[role][element]);
      STYLE_MAP.set(element, model)
      $chat.updateStyle(element, model, [role])
    }
  }

  for (const element of ELEMENT_LIST) PANEL_MAP.set(element, new StylePanel(element, IS_TEXT_ELEMENT.includes(element) ? 'text' : IS_IMAGE_ELEMENT.includes(element) ? 'image' : 'element'))
}

function exportJson() {
  const json = {};
  for (const [role, element_model_map] of ROLE_MODEL_MAP.entries()) {
    const element_json = {};
    for (const [element, model]of element_model_map.entries()) {
      element_json[element] = model.data
    }
    json[role] = element_json;
  }
  console.debug(json);
  return json;
}


$('app').content([
  $('h1').content(['YouTube Chat Designer v1.0', $('span').content('DEFAULTKAVY')]),
  $('div').class('content').content([
    $('div').class('console').content([
      $('div').class('menu').content([
        $('div').class('action-row').content([
          $('div').class('role-list').content([
            $('span').content('Role'),
            $('div').content([
              ROLE_LIST.map(id => [
                $('div').class('role').content($div => [
                  $('input').class('role-checkbox').type('checkbox').value(id).id(id.toLowerCase()).on('input', refreshPanel),
                  $('label').content(id).for(id.toLowerCase())
                    .on('click', (e) => {
                      const checkboxes = $<$Input>('::.role-checkbox')
                      if (e.shiftKey) return;
                      checkboxes.forEach($input => {if ($input.id() !== id.toLowerCase()) $input.checked(false)})
                    })
                ])
              ])
            ])
          ]),
          $('div').class('button-list').content([
            $('button').content('Select All').on('click', (e, $button) => {
              const $input_list = $<$Input>('::.role-checkbox');
              const IS_ALL_CHECKED = !$input_list.find($input => $input.checked() === false);
              $input_list
                .slice(IS_ALL_CHECKED ? 1 : 0)
                .forEach($input => $input.checked(!IS_ALL_CHECKED))
              refreshPanel();
            }),
            $('button').content('Export JSON').on('click', () => exportJson()),
            $('button').content('Export CSS').on('click', () => exportCSS())
          ]),
        ]),
        $('div').class('element-list').content($content => [
          ELEMENT_LIST.map(id => {
            $view.set(id, PANEL_MAP.get(id)!)
            return $('button').staticClass('element-button').content(id).on('click', (e, $button) => $view.switch(id))
              .self($button => {
                $view.event.on('switch', content_id => {
                  if (content_id !== id) $button.removeClass('active');
                  else $button.addClass('active')
                })
              })
              .on('mouseenter', e => {
                $chat.showHint(id)
              })
          })
        ]).on('mouseleave', e => {
          $chat.hideHint();
        }),
      ]),
      $view
    ]),
  
    $('div').class('preview').content([
      $('header').content([
        $('h2').content('YouTube Chat Preview'),
        new ColorInput('ytchat-background-color').label('Background Color').value('#131313').on('input', (e, $input) => {
          $chat.css({backgroundColor: $input.$color.value()})
        })
      ]),
      $chat,
      $('div').class('input-panel').content([
        $('div').content([
          $('select').id('role-select').add([
            ROLE_LIST.map(role => $('option').content(role).value(role))
          ]),
          $('input').id('username').placeholder('User Name')
        ]),
        $('div').content([
          $('textarea').id('message-input').attribute('placeholder', 'Type here...').on('keydown', e => {
            if (e.key === 'Enter') {e.preventDefault(); send();}
          }),
          $('button').content('Send').on('click', (e) => {
            send();
          })
        ])
      ])
    ])
  ])
]).self($app => document.body.append($app.dom))
load();

exportCSS();
function load() {
  $view.switch('Message');
  $<$Input>(':#normal')?.checked(true);
  refreshPanel();
}

function refreshPanel() {
  PANEL_MAP.forEach(panel => panel.layout())
}

function send() {
  const message = $<$Textarea>(':#message-input')!.value().trim();
  if (message === '') return;
  $chat.send({
    name: $<$Input>(':#username')!.value(),
    message: message,
    role: $<$Select>(':#role-select')!.value() as any
  })
  $chat.dom.scrollTop = $chat.dom.scrollHeight;
}

function exportCSS() {
  let css = ytchat_css;
  for (const [ROLE, MODEL_MAP] of ROLE_MODEL_MAP) {
    for (const [ELEMENT, MODEL] of MODEL_MAP) {
      let selector = ROLE === 'Normal' ? `yt-live-chat-text-message-renderer` : `yt-live-chat-text-message-renderer[author-type="${ROLE.toLowerCase()}"]`
      switch (ELEMENT) {
        case 'Message': selector +=  ' #message'; break;
        case 'Name': selector +=  ' #author-name '; break;
        case 'Badge': selector +=  ' #chat-bagdes'; break;
        case 'Avatar': selector +=  ' #author-photo'; break;
        case 'Author Area': selector +=  ' yt-live-chat-author-clip'; break;
        case 'Content Area': selector +=  ' #content'; break;
        case 'Outer Area': break;
      }
      let stylesheet = '';
      for (const [key, value] of Object.entries(MODEL.data)) {
        stylesheet += ` ${toCssProp(key)}: ${value} !important;\n`
      }
      css += `${selector} {\n${stylesheet}\n}\n\n`
    }
  }

  console.debug(css)

  function toCssProp(str: string) {
    return str.replaceAll(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`)
  }
}