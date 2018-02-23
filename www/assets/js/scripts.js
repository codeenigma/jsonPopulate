/**
 * @file
 */

(function ($) {
  /**
   * Storage for current item.
   */
  window.jsonPopulate = {};
  window.jsonPopulate.current = [];
  window.jsonPopulate.supported = 'a, p, span, h1, h2, h3, h4, h5, h6, img, svg, input[type="submit"], input[type="button"], label';
  /**
   * Unset current item.
   */
  function cleanCurrent() {
    window.jsonPopulate.current = [];
  }
  /**
   * Populate the current choices for a given item.
   *
   * @param obj item
   * A jQuery object.
   * @param bool recurse
   * Wether we are being called as child object.
   */
  function populateCurrent(item, recurse) {
    switch (item.prop("tagName").toLowerCase()) {
      case 'p':
      case 'label':
      case 'span':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        window.jsonPopulate.current.push(item.prop("outerHTML"));
        window.jsonPopulate.current.push(item.text());
        break;

      case 'a':
        window.jsonPopulate.current.push(item.prop("outerHTML"));
        window.jsonPopulate.current.push(item.text());
        window.jsonPopulate.current.push(item.prop('href'));
        break;

      case 'img':
        window.jsonPopulate.current.push(item.prop("outerHTML"));
        window.jsonPopulate.current.push(item.prop('src'));
        break;

      case 'svg':
        window.jsonPopulate.current.push(item.prop("outerHTML"));
        break;
      case 'input':
        //@todo Need to filter on type.
        window.jsonPopulate.current.push(item.prop("outerHTML"));
        window.jsonPopulate.current.push(item.prop('value'));
        break;
    }
    if (window.jsonPopulate.current.length > 0 && !recurse) {
      highlightItem(item);
    }
    // @todo Do we want to process children of non supported tags ?
    item.children().each(function (index, child) {
      populateCurrent($(child), true);
    });
  }

  /**
   * Visually highlight current item.
   */
  function highlightItem(item) {

    $(window.jsonPopulate.highlight).css({
      'width': item.width(),
      'height': item.height(),
      'z-index': item.css('z-index') + 1
    }
    ).position({
      'my': 'top left',
      'at': 'top left',
      'of': item
    }
    );
  }

  /**
   * Spit panes in 2.
   */
  function splitPanes() {
    var sizes = localStorage.getItem('jsonPopulateSplit')
    if (sizes) {
      sizes = JSON.parse(sizes)
    } else {
      sizes = [50, 50]
    }
    var split = Split(['#form', '#iframe-wrap'], {
      sizes: sizes,
      onDragEnd: function () {
        localStorage.setItem('jsonPopulateSplit', JSON.stringify(split.getSizes()));
      }
    })
  }

  /**
   * Bind form behaviours.
   */
  function bindForm() {
    bindAutocomplete();
    bindCollapsible();
    bindSave();
  }
  /**
   * Bind autocomplete behaviour for input.
   */
  function bindAutocomplete() {
    $('#json-populate > #form input').autocomplete({
      source: window.jsonPopulate.current,
      minLength: 0,
    }).focus(function () {
      var countItems = window.jsonPopulate.current.length;
      if (countItems > 1) {
        $(this).autocomplete("option", "source", window.jsonPopulate.current);
        $(this).autocomplete("search", "");
      } else {
        if (countItems) {
          $(this).val(window.jsonPopulate.current[0]);
        }
      }
    });
  }
  /**
   * Bind save behaviour for input.
   */
  function bindSave() {
    //@todo error handling.
    $('#json-populate > #form input').blur(function () {
      var submitData = $('#json-populate > #form').serialize();
      var submitUrl = $('#json-populate > #form').attr('action');
      $.post(submitUrl, submitData);
    });
  }
  /**
   * Bind collapsible fieldsets.
   */
  function bindCollapsible() {
    $('#json-populate > #form legend').click(function () {
      $(this).siblings().toggle();
    });
  }

  /**
   * Bind iframe tweaks.
   */
  function bindFrame() {
    var domContent = $('#json-populate > #iframe-wrap > iframe').contents();
    var targetBody = domContent.find('body');
    window.jsonPopulate.highlight = $('<div id="json-populate-highlight" style="background-color:green;border:1px solid #00F;margin:0;padding:0;opacity:0.3;width:0;height:0;position:absolute;left:-9999;">&nbsp</div>');
    targetBody.append(window.jsonPopulate.highlight);
    $(targetBody).on('click', window.jsonPopulate.supported, function (e) {
      processIframeItemClicked($(this), e);
    });

  }

  /**
   * Process an item clicked within iframe.
   * @param item
   * @param event
   */
  function processIframeItemClicked(item, event) {
    if (event.altKey) {
      return processIframeItemClickedAlt(item, event);
    }
    return processIframeItemClickedStandard(item, event)
  }

  /**
   * Process an item clicked within iframe.
   * @param item
   * @param event
   */
  function processIframeItemClickedAlt(item, event) {
    // Not a link, nothing we should do.
    if (item.attr('href') === undefined) {
      return;
    }
    var oldref = item.attr('href');
    // Anchor link, nothing we should do.
    if (isAnchor(oldref)) {
      return;
    }
    // Link to another page, pass through to iframe.
    var original = $('#json-populate > #iframe-wrap > iframe').attr('src');
    var newref = original + '&page=' + oldref;
    $('#json-populate > #iframe-wrap > iframe').attr('src', newref);
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Process an item clicked within iframe.
   * @param item
   * @param event
   */
  function processIframeItemClickedStandard(item, event) {
    event.preventDefault();
    event.stopPropagation();
    cleanCurrent();
    populateCurrent(item, false);
  }

  /**
   * Determines if a link is an anchor to the same page.
   * @param {string} href
   * @returns {bool}
   */
  function isAnchor(href) {
    if (href.indexOf('#') === 0) {
      return true;
    }
    return false;
  }
  /**
   * Populate the current choices for a given item.
   *
   * @param obj item
   * A jQuery object.
   */
  function bindFrameElement(item) {
    $(item).click(function (e) {
      processIframeItemClicked($(this), e);
    });
  }

  /**
   * Page load binding.
   */
  $(document).ready(function () {
    splitPanes();
    bindForm();
  });

  /**
   * Frame load binding.
   */
  $('iframe').on('load', function () {
    bindFrame();
  });

})(jQuery);
