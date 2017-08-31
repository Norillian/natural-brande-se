// TODO
// Change Message box to fixed since we are no longer scrolling up after each fucking purchase
// If there is time, implement a queue system for when someone is spamming the buy button


var basketApi = (function($, _) {

	var basketContent = {};

	var production = false;
	// var production = true;

	var constants = {
    jplUrl: '/Services/ProductService.asmx/Products', // JSON Product list base URL
    apiUrl: '/sessionservices/v2/basket/current/', // Basket API base URL
    // defaultImageUrl: "/SL/SI/596/7e8d0f1e-58b2-4bcb-a41d-d124a29c18fc.jpg"
    messageBoxTimer: 3000, // The time a message box is shown before it fades out again
    messageBoxFadeTime: 500 // The duration of the fade in and out animations
  }

  /* Logger function that will drop any attempt to log when this.production is true */
	function debugLog() {
		if(!production) {
			console.log.apply(console, arguments);
		}
	}

	function update() {
		read().done(function(data) {
			debugLog(basketContent);

			// updateBasket when on checkout page
			if(location.pathname === "/basket/shoppingcart.aspx") {
				updateBasket(false);
			} else if(location.path === "/basket/shoppingcart_step3.aspx") {
				updateBasket(true);
			}
			updateMiniBasket();
		}).fail(function(res) {
			debugLog("update(): %s", res);
		})
	}

	function read() {

    var basketGet = $.ajax({
      cache: false,
      url: constants.apiUrl,
      error: function(res) {
        debugLog("read(): %s", res);
      },
      success: function(res) {
      }
    });

    var basketLinesGet = new $.Deferred();

    basketGet.done(function(res) {
      basketContent = res.data;
      if(basketContent.basketGuid !== "00000000-0000-0000-0000-000000000000") {
      	// Basket not empty
        $.ajax({
          cache: false,
          url: constants.apiUrl + 'line?include=desc',
          error: function(res) {
          	debugLog("read(): Empty basket");
          	basketContent.isEmpty = true;
            basketLinesGet.resolve();
          },
          success: function(res) {
          	basketContent.isEmpty = false;
            basketContent.lines = res.data.items;
            basketLinesGet.resolve();
          }
        });
      	
      } else {
      	basketContent.isEmpty = true;
      	debugLog("read(): No basket");
      	basketContent.lines = [];
      }
    });

    return basketLinesGet;
  }

	function create(eSellerId, quantity) {
    var data = [];

    var item = {
      referencingId: eSellerId,
      productType: 'product',
      quantity: quantity
    }

    data.push(item);

    return $.ajax({
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      url: constants.apiUrl + 'line',
      data: JSON.stringify(data),
      error: function(res) {
        console.log(res);
      },
      success: function(res){
      }
    });
  }

  function displayBasketMessage(msg) {
    var html = templates['basketMessage']({
      message: msg
    });
    $('#ucInfoMessagebdy').remove();
    $('#precontentContainer').append(html);

    $('#ucInfoMessagebdy').fadeIn(constants.messageBoxFadeTime);
    setTimeout(function() {
      $('#ucInfoMessagebdy').fadeOut(constants.messageBoxFadeTime);
    }, constants.messageBoxTimer);
  }

  function updateBasket(onCheckout) {
  	if(basketContent.isEmpty) {
  		var html = templates.emptyBasket({
  			// Some labels
  		});
  		$('#basket').empty().append(html);
  	} else {
  		var html = templates.shoppingCart({
        // Some labels
      });

      $('#basket').empty().append(html);
  	}
  }

  function updateMiniBasket() {

  	var productCount = _.reduce(basketContent.lines, function(memo, line) { return memo + line.quantity }, 0);

  	var html = templates['miniBasket']({
      // Some data
      formattedAmount: formatMoney(basketContent.basketTotal.priceIncVat, basketContent.basketTotal.currencySymbol),
      productCount: productCount
    });
    $('#miniBasket').empty().html(html);
  }

  function formatMoney(num,cur){
    return cur + ' ' + parseFloat(Number(num).toFixed(2)).format(2, 3, '.', ',');
  }

	update();

	return {
		// Public interface to basket API
		addItem: function(eSellerId, quantity) {
    	create(eSellerId, quantity).done(function(data) {

        var message = data && data.data && data.data.items && data.data.items[0].messages && 
        							data.data.items[0].messages[0] && data.data.items[0].messages[0].message;

        if(message) {
          displayBasketMessage(message);
        }

        update();

      }).fail(function(res) {
      	debugLog("addItem(): %s", res);
      });
  	}
	}


})($, _);

Number.prototype.format = function(n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
  num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};