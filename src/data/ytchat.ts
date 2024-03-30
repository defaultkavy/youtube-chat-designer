export const ytchat_css = `yt-live-chat-renderer yt-live-chat-header-renderer,
yt-live-chat-renderer yt-live-chat-ticker-renderer,
yt-live-chat-renderer yt-live-chat-message-input-renderer,
yt-live-chat-renderer yt-reaction-control-panel-overlay-view-model,
yt-live-chat-viewer-engagement-message-renderer,
yt-live-chat-banner-manager,
yt-live-chat-docked-message {
  display: none !important;
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