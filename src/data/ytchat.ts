export const ytchat_css = `yt-live-chat-renderer yt-live-chat-header-renderer,
yt-live-chat-renderer yt-live-chat-ticker-renderer,
yt-live-chat-renderer yt-live-chat-message-input-renderer,
yt-live-chat-renderer #reaction-control-panel-overlay,
yt-live-chat-renderer #action-panel,
yt-live-chat-renderer #inline-toast-container,
yt-live-chat-renderer #panel-pages,
yt-live-chat-renderer #promo,
yt-live-chat-viewer-engagement-message-renderer,
yt-live-chat-banner-manager,
yt-live-chat-docked-message {
  display: none !important;
}
#item-scroller {
  overflow: hidden !important;
}
html, body, yt-live-chat-app, yt-live-chat-renderer {
  background: #00000000 !important;
}
yt-live-chat-text-message-renderer {
  position: relative;
  overflow: hidden;
}
yt-live-chat-text-message-renderer #author-photo {
  overflow: hidden;
  flex-shrink: 0;
}
yt-live-chat-text-message-renderer #author-photo img {
  height: 100%;
  width: 100%;
}
yt-live-chat-text-message-renderer #content {
  width: 100%;
}
yt-live-chat-text-message-renderer #menu {
  display: none;
}
yt-live-chat-text-message-renderer #chat-badges {
  display: flex !important;
  align-items: center !important;
  gap: 0.2rem !important;
}
yt-live-chat-text-message-renderer yt-live-chat-author-chip {
  align-items: unset !important;
}
yt-live-chat-text-message-renderer yt-live-chat-author-badge-renderer[type="moderator"] {
  display: block;
  height: 16px;
  width: 16px;
  fill: #5e84f1;
}

`