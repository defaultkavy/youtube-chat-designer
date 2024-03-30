import { $, $Button, $Select, $Textarea } from 'fluentx';
import { StylePanel } from './structure/StylePanel';
import { StyleModel } from './structure/StyleModel';
import { defaultStyle } from './data/defaultStyle';
import { YouTubeChat } from './structure/YouTubeChat';
import { $Input } from 'fluentx/lib/$Input';
import { ColorInput } from './component/ColorInput';
import { ytchat_css } from './data/ytchat';
import { config } from './config';

export const ROLE_MODEL_MAP = new Map<string, Map<string, StyleModel>>();
const ROLE_LIST = ['Normal', 'Member', 'Moderator', 'Owner'];
const ELEMENT_LIST = ['Message', 'Name', 'Avatar', 'Author Area', 'Content Area', 'Outer Area'];
const IS_TEXT_ELEMENT = ['Message', 'Name', 'Timestamp'];
const IS_IMAGE_ELEMENT = ['Badge', 'Avatar'];
const PANEL_MAP = new Map<string, StylePanel>();

const $view = $('view');
export const $chat = new YouTubeChat().css({backgroundColor: '#131313'})
  .send({name: 'Normal User', message: 'Hover mouse on the message will show the author role info.', role: 'Normal'})
  .send({name: 'Member User', message: 'You can use Shift + Left Click on Role list to select multiple role!', role: 'Member'})
  .send({name: 'Moderator User', message: 'If you want to save your settings, using Copy JSON and save it, you can paste the JSON to recovery your settings.', role: 'Moderator'})
  .send({name: 'Owner User', message: 'Try to send message for test your design.', role: 'Owner'})

init();
function init(data = defaultStyle) {
  ROLE_MODEL_MAP.clear();
  for (const role of ROLE_LIST) {
    const STYLE_MAP = new Map<string, StyleModel>()
    ROLE_MODEL_MAP.set(role, STYLE_MAP);
    for (const element of ELEMENT_LIST) {
      const model = new StyleModel(data[role][element]);
      STYLE_MAP.set(element, model)
      $chat.updateStyle(element, model, [role])
    }
  }
  $view.deleteAllView().clear();
  for (const element of ELEMENT_LIST) {
    const $panel = new StylePanel(element, IS_TEXT_ELEMENT.includes(element) ? 'text' : IS_IMAGE_ELEMENT.includes(element) ? 'image' : 'element');
    PANEL_MAP.set(element, $panel)
    $view.setView(element, $panel)
  }
}


$('app').content([
  $('h1').content(['YouTube Chat Designer', $('span').content(config.version)]),
  $('div').class('content').content([
    $('div').class('console').content([
      $('div').class('menu').content([
        $('div').class('action-row').content([
          $('div').class('role-list').content([
            $('button').content('ROLE').on('click', () => {
              const $input_list = $<$Input>('::.role-checkbox');
              const IS_ALL_CHECKED = !$input_list.find($input => $input.checked() === false);
              $input_list
                .slice(IS_ALL_CHECKED ? 1 : 0)
                .forEach($input => $input.checked(!IS_ALL_CHECKED))
              refreshPanel();
            }),
            $('div').content([
              ROLE_LIST.map(id => [
                $('div').class('role').content($div => [
                  $('input').class('role-checkbox').type('checkbox').value(id).id(id.toLowerCase()).on('input', refreshPanel),
                  $('label').content(id).for(id.toLowerCase())
                    .on('click', (e) => {
                      const $input_list = $<$Input>('::.role-checkbox');
                      const $self_input = $div.$<$Input>(`input#${id.toLowerCase()}`);
                      const IS_MULTI_CHECKED = $input_list.filter($input => $input.checked()).length > 1;
                      if (e.shiftKey) {
                        if (IS_MULTI_CHECKED) return;
                        else {
                          if ($self_input.checked()) return e.preventDefault();
                          return
                        };
                      }
                      if ($self_input.checked()) return e.preventDefault();
                      $input_list.forEach($input => {
                        if ($input.id() !== id.toLowerCase()) $input.checked(false)
                      })
                    })
                ])
              ])
            ])
          ]),
          $('div').class('button-list').content([
            $('div').class('button-group').content([
              $('span').content('JSON'),
              $('button').content('Paste').self($button => {
                let timer: Timer | undefined;
                $button.on('click', async (e) => {
                  const json_string = await navigator.clipboard.readText();
                  try {
                    const json = JSON.parse(json_string);
                    init(json);
                  } catch (err) {
                    $button.content('Error!').class('error');
                    timer = setTimeout(() => {
                      $button.removeClass('error').content('Paste');
                      timer = undefined;
                    }, 3000);
                    return;
                  }
                  load();
                  $button.content('Pasted!').class('done')
                  if (timer) clearTimeout(timer);
                  timer = setTimeout(() => {
                    $button.removeClass('done').content('Paste');
                    timer = undefined;
                  }, 3000);
                })
              }),
              $('button').content('Copy').self($button => {
                let timer: Timer | undefined;
                $button.on('click', (e) => {
                  navigator.clipboard.writeText(JSON.stringify(exportJson()));
                  $button.content('Copied!').class('done')
                  if (timer) clearTimeout(timer);
                  timer = setTimeout(() => {
                    $button.removeClass('done').content('Copy');
                    timer = undefined;
                  }, 3000);
                })
              })
            ]),
            $('div').class('button-group').content([
              $('span').content('CSS'),
              $('button').content('Copy').self($button => {
                let timer: Timer | undefined;
                $button.on('click', (e) => {
                  navigator.clipboard.writeText(exportCSS());
                  $button.content('Copied!').class('done')
                  if (timer) clearTimeout(timer);
                  timer = setTimeout(() => {
                    $button.removeClass('done').content('Copy');
                    timer = undefined;
                  }, 3000);
                })
              })
            ])
          ]),
        ]),
        $('div').class('element-list').content($content => [
          ELEMENT_LIST.map(id => {
            return $('button').staticClass('element-button').content(id).on('click', (e, $button) => $view.switchView(id))
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
  $view.switchView('Message');
  $<$Input>('::.role-checkbox')?.forEach($input => $input.checked(false));
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
  return css;

  function toCssProp(str: string) {
    return str.replaceAll(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`)
  }
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
  return json;
}