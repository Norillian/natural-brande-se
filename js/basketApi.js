// TODO
// Change Message box to fixed since we are no longer scrolling up after each fucking purchase
// If there is time, implement a queue system for when someone is spamming the buy button
// Delivery fee line has a * in the vanilla controller


var basketApi = (function($, _) {

	var basketContent = {};
	var linesToUpdate = {};

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

	function init() {
		// No need for basket API on checkout page
		if(location.pathname !== "/basket/shoppingcart_step3.aspx") {
			copyAndHideControlButtons();
			update();
		}
		if(location.pathname.indexOf('/pi/') !== -1) {
			// We are on the product detail page
			replaceAddToBasketButtonHandler();
		}
		basketLineUpdateListeners();
	}

	function update() {
		read().done(function(data) {
			debugLog(basketContent);

			// updateBasket when on checkout page
			if(location.pathname === "/basket/shoppingcart.aspx") {
				updateBasket(false);
			} else if(location.pathname === "/basket/shoppingcart_step3.aspx") {
				updateBasket(true);
			}
			setupButtonListeners();
			
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
            // There are lines, add to them the JSON Product list info for each product
            var products = _.map(res.data.items, 
            											function(line) {
            												return line.internalItemId1;
            											}).join(';');
            var apiCall = constants.jplUrl + '?v=1.0&lId=0&locId=' + locId + '&cId=' + cId + '&langId=' + 
            							langId + '&countryId=' + contId +  '&customerId=' + (typeof customerId !== "undefined" ? customerId : 0 ) + 
            							'&pIds=' + products;
            debugLog("read(): %s", apiCall);
            $.ajax({
            	url: apiCall,
            	error: function(res) {
            		debugLog("read(): %s", res);
            		basketLinesGet.resolve();
            	},
            	success: function(res) {
            		// Received JSON API products
            		basketContent.lines.forEach(function(line) {
            			res.data.items.forEach(function(product) {
            				if(line.internalItemId1 == product.eSellerId) {
            					line.jpl = product;
            				}
            			});
            		});
            		debugLog(basketContent);
            		basketLinesGet.resolve();		
            	}
            });
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
        debugLog(res);
      },
      success: function(res){
      }
    });
  }

  function deleteLine(eSellerId) {
  	return $.ajax({
      type: "DELETE",
      contentType: "application/json",
      dataType: "json",
      url: constants.apiUrl + 'line/' + eSellerId,
      error: function(res) {
        debugLog(res);
      },
      success: function(res){
      }
    });
  }

  // Update an item in the basket.
  function updateById(id, quantity) {

  	var items = []
    items.push({
      basketLineId: id,
      quantity: quantity
    });

    return $.ajax({
      type: "PUT",
      contentType: "application/json",
      dataType: "json",
      url: constants.apiUrl + 'line',
      data: JSON.stringify(items),
      error: function(res) {
        console.log(res);
      },
      success: function(res){
      }
    });
  }

  function updateItem(eSellerId, quantity) {

  	// Do some checks:
  	// Find nearest matching bundleSize if necessary
  	// Make sure quantity doesn't exceed available inventory
  	// inventoryCount
  	var messageOverride = "";
  	basketContent.lines.forEach(function(line) {
  		if(eSellerId == line.id) {
  			// On the matching basket line for this id
  			if(line.jpl.bundleSize !== undefined && line.jpl.bundleSize > 1) {
  				// If there is a bundlesize > 1
  				var bundleSize = line.jpl.bundleSize
  				if((quantity % bundleSize) !== 0) {
  					// And this bundlesize is not matched by the given quantity
  					// Increase the quantity to the closes match
  					debugLog("updateItem(): Increased quantity by %i", bundleSize - (quantity % bundleSize));
  					quantity += bundleSize - (quantity % bundleSize);
  					// "Arion No Grain Salmon & Potato 150g (20)" ska bestillas i kolli av 20, Du behöver beställa ytterligare 19, så det totala antalet blir 40. Klicka här för att gå till varukorgen.
  					messageOverride = 'Antal blev rettet til at matche kolli';
  				}
  			}
  			if(line.jpl.inventoryCount < quantity) {
  				// If quantity exceeds inventory
  				quantity = line.jpl.inventoryCount;
  				debugLog("updateItem(): Reducing quantity to match inventoryCount: %i ", quantity);
  				messageOverride = 'Antal blev rettet til at matche lagerantal';
  			}
  		}
  	});

  	updateById(eSellerId, quantity).done(function(data) {

  		debugLog(data);

  		var kolliWarningMessage = '{productName} ska bestillas i kolli av {bundleSize}, Du behöver beställa ytterligare {difference},' + 
  															' så  det totala antalet blir {total}. <a href="http://www.natural-sverige.se/basket/shoppingcart.aspx">' + 
  															'Klicka här</a> för att gå till varukorgen.';


      displayBasketMessage(messageOverride !== '' ? messageOverride : 'Din varukorg är uppdaterad.');
      // var message = data && data.data && data.data.items && data.data.items[0].messages && 
      // 							data.data.items[0].messages[0] && data.data.items[0].messages[0].message;

      // if(message) {
      //   displayBasketMessage(message);
        
      // }

      update();

    }).fail(function(res) {
    	debugLog("updateItem(): %s", res);
    });
	}

	function deleteItem(eSellerId) {
		deleteLine(eSellerId).done(function(data) {
			debugLog(data);

			update();
		}).fail(function(res) {
			debugLog("deleteItem(): %s", res);
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
        onCheckout : onCheckout,
        lines: basketContent.lines,
        currency: basketContent.lineTotal.currencySymbol,
        helpers: {
        	formatMoney: formatMoney
        }
      });

      $('#basket').empty().append(html);

      html = templates.shoppingCartTotals({
      	basket: basketContent,
      	currency: basketContent.basketTotal.currencySymbol,
      	helpers: {
        	formatMoney: formatMoney
        }
      });

      $('.basketTotalsBdy').replaceWith(html);

      html = templates.basketButtons({
      	onCheckout : onCheckout
      });
      $('.basketBottomNavBdy').replaceWith(html);
  	}
  }

  function replaceAddToBasketButtonHandler() {
  	// debugLog("replaceAddToBasketButtonHandler(): Not implemented");
  	$('.addToBasketBtn').attr('onclick', 'basketApi.addItem(pId, (isNaN($(".etBasket input").val()) ? 1 : $(".etBasket input").val() ))');
  }

  function copyAndHideControlButtons() {
  	var copy = $('.basketBottomNavBdy').clone();
  	$(copy).removeClass('basketBottomNavBdy').addClass('hiddenBasketBottomNavBdy').hide();
  	$('.basketOuterBdy').append(copy);
  }

  // Set up listeners for the buttons in a basket or minibasket
  function setupButtonListeners() {
    
    $('.basketBottomNavBdy .basketUpdAll').on('click', function(e) {
    	debugLog("setupButtonListeners(): %s", linesToUpdate);
      _.each(_.pairs(linesToUpdate), function(line, i) {
        updateItem(line[0], line[1]);
      });
      linesToUpdate = {};
    });

    $('.basketBottomNavBdy .basketClrAll').on('click', function(e) {
      $('.hiddenBasketBottomNavBdy .basketClrAll input').click();
    });

    $('.basketBtnDiv .buttonNavNext').on('click', function(e) {
      $('.hiddenBasketBottomNavBdy .basketNxtStep2 input').click();
    });

    $('.basketBottomNavBdy .buttonNavNext').on('click', function(e) {
      $('.hiddenBasketBottomNavBdy .basketNxtStep2 input').click();
    });
  }

  function basketLineUpdateListeners() {
    // Intercept input in 'input' tags so that we can keep track of the user's changes
    // to the basket.
    // This is to facilitate the use-case that a user changes the values in multiple lines
    // and then presses the 'opdater alt' button
    $(document).on('keyup', function(e) {
      if($(e.target).hasClass('shoppingCartInput') && !$(e.target).prop("is:disabled")) { // Ignore inputs that were disabled by constrainedInputBasket
        if (e.keyCode == 13) {
          var lineId = parseInt($(e.target).attr('data-lineid'));
          var value = parseFloat($(e.target).val());
          if(!isNaN(value)) {
 	          // var bundleSize = parseInt($(e.target).attr('data-bundlesize'));
 	          // if(!isNaN(bundleSize) && (value % bundleSize) !== 0) {
 	          // 	displayBasketMessage("urmom");
 	          // } else {
 	          // }
            updateItem(lineId, value);
            e.stopPropagation();
            return true;
          } else {
            console.log("value is not a number!");
            return true;
          }
        } else {
          var inputField = $(e.target);
          var lineId = parseInt(inputField.attr('data-lineid'));
          var value = parseFloat(inputField.val());
          if(!isNaN(value)) {
            linesToUpdate[lineId] = value;
          }
        }
      }
    });
  }

  function updateMiniBasket() {

  	var productCount = _.reduce(basketContent.lines, function(memo, line) { return memo + line.quantity }, 0);

  	var html = templates['miniBasket']({
      // Some data
      formattedAmount: formatMoney(basketContent.basketTotal.priceIncVat, basketContent.basketTotal.currencySymbol),
      productCount: productCount
    });
    $('#miniBasket').empty().html(html);

    $('#miniBasketMobile .miniBasketItemCount span').text(productCount);
  }

  function formatMoney(num,cur){
    return cur + ' ' + parseFloat(Number(num).toFixed(2)).format(2, 3, '.', ',');
  }

  $(document).ready(function() {
		init();
  });

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
  	},
  	deleteItem: function(eSellerId) {
			deleteLine(eSellerId).done(function(data) {
				debugLog(data);

				displayBasketMessage('Din varukorg är uppdaterad.');

				update();
			}).fail(function(res) {
				debugLog("deleteItem(): %s", res);
			});
		}
	}


})($, _);

Number.prototype.format = function(n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
  num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};