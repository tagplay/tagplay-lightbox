'use strict';

module.exports = {
  open: openLightbox,
  close: closeLightbox
};

function openLightbox (content, canNavigate, navigate, id, onClose) {
  // We're not actually closing-closing the lightbox here, so don't pass the onClose callback
  closeLightbox();

  var backdrop = document.createElement('div');
  backdrop.setAttribute('class', 'tagplay-lightbox-backdrop');
  backdrop.setAttribute('tabindex', 0);
  backdrop.onkeydown = function (e) {
    if (!e) e = window.event;
    if (e.keyCode === 37) {
      navigate(-1);
    } else if (e.keyCode === 39) {
      navigate(1);
    } else if (e.keyCode === 27) {
      closeLightbox(onClose);
    }
  };

  var lightbox = document.createElement('div');
  lightbox.setAttribute('class', 'tagplay-lightbox');
  if (id) {
    lightbox.setAttribute('id', id);
  }

  var closeButton = document.createElement('a');
  closeButton.setAttribute('class', 'tagplay-lightbox-close');
  closeButton.setAttribute('href', '#');
  closeButton.innerHTML = '&times;';
  closeButton.onclick = function () {
    closeLightbox(onClose);
    return false;
  };

  document.body.originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  lightbox.appendChild(content);

  if (canNavigate(-1)) {
    lightbox.appendChild(arrow(-1, navigate, 'tagplay-lightbox-prev'));
  }
  if (canNavigate(1)) {
    lightbox.appendChild(arrow(1, navigate, 'tagplay-lightbox-next'));
  }

  backdrop.onclick = function (e) {
    var shouldClose = true;
    var currentTarget = e.target;
    while (currentTarget) {
      if (currentTarget === lightbox) {
        shouldClose = false;
        break;
      }
      currentTarget = currentTarget.parentNode;
    }
    if (shouldClose) closeLightbox(onClose);
  };

  backdrop.appendChild(closeButton);
  backdrop.appendChild(lightbox);
  document.body.appendChild(backdrop);
  backdrop.focus();
}

function closeLightbox (callback) {
  var existingBackdrop = document.getElementsByClassName('tagplay-lightbox-backdrop');
  if (existingBackdrop.length > 0) {
    for (var i = 0; i < existingBackdrop.length; i++) {
      document.body.removeChild(existingBackdrop[i]);
    }
    document.body.style.overflow = document.body.originalOverflow || 'auto';
    if (callback) callback();
    return true;
  }
  return false;
}

function arrow (direction, navigate, className) {
  var a = document.createElement('a');
  a.setAttribute('href', '#');
  a.setAttribute('class', className);
  a.onclick = function (e) {
    if (!e) e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    navigate(direction);
    return false;
  };
  return a;
}
