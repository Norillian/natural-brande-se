var templates = templates || {};
$.extend(templates, { 
basketButtons: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 if(!onCheckout) { 
__p+='\r\n  <div class="clearfix">\r\n\r\n  </div>\r\n  <div class="basketBottomNavBdy">\r\n    <a class="basketNxtStep2 right">\r\n      <span class="buttonNavNext">\r\n        '+
((__t=( labels.goToRegister ))==null?'':__t)+
'\r\n        <!-- Gå til kassen -->\r\n      </span>\r\n    </a>\r\n    <a class="basketUpdAll right">\r\n      <span class="buttonUpdateBasket">\r\n        '+
((__t=( labels.updateBasket ))==null?'':__t)+
'\r\n        <!-- Opdater indhold -->\r\n      </span>\r\n    </a>\r\n    <a class="basketClrAll right">\r\n      <span class="buttonClearBasket">\r\n        '+
((__t=( labels.emptyBasket ))==null?'':__t)+
'\r\n        <!-- Tøm kurven -->\r\n      </span>\r\n    </a>\r\n  </div>\r\n';
 } else { 
__p+='\r\n  <div class="clearfix">\r\n\r\n  </div>\r\n  <a class="basketNxtStep2">\r\n    <span class="buttonNavNext">\r\n      '+
((__t=( labels.goToPayment ))==null?'':__t)+
'\r\n      <!-- Gå til betaling -->\r\n    </span>\r\n  </a>\r\n';
 } 
__p+='\r\n';
}
return __p;
}
 });
var templates = templates || {};
$.extend(templates, { 
basketMessage: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="ucInfoMessagebdy" class="esebdy" style="margin-left: -273.5px;">\r\n	<i class="fa fa-close"></i>\r\n	<div class="notAddedToBasket">\r\n		'+
((__t=( message ))==null?'':__t)+
'\r\n	</div>\r\n</div>';
}
return __p;
}
 });
var templates = templates || {};
$.extend(templates, { 
emptyBasket: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="basketIsEmptyBdy">\r\n	<h1>\r\n		Kundvagnen är tom!\r\n	</h1><br>\r\n	<a href="/" class="buttonNavPrev">\r\n		Fortsätt handla\r\n	</a>\r\n</div>';
}
return __p;
}
 });
var templates = templates || {};
$.extend(templates, { 
miniBasket: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<a href="/basket/shoppingcart.aspx" class="show-for-medium-up show-for-large-up">\r\n	<div class="basketCartImg">\r\n		<img src="/media/349/img/basketCart.png">\r\n		<span class="miniBasketItemCount">\r\n			'+
((__t=( productCount ))==null?'':__t)+
'\r\n		</span>\r\n	</div>\r\n	<span class="miniBasketText">\r\n		'+
((__t=( formattedAmount ))==null?'':__t)+
'\r\n	</span>\r\n</a>\r\n';
}
return __p;
}
 });
var templates = templates || {};
$.extend(templates, { 
shoppingCart: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 if(!onCheckout) { 
__p+='\r\n<div class="basketTopNavBdy">\r\n    <div class="basketHeader">\r\n        <h1>\r\n          Korg\r\n          <!-- Indkøbskurv -->\r\n        </h1>\r\n    </div>\r\n    <div class="basketBtnDiv clearfix">\r\n        <div class="basketPreStep left">\r\n            <a class="buttonNavPrev">\r\n              Fortsätt handla\r\n              <!-- shop videre -->\r\n            </a>\r\n        </div>\r\n        <div class="basketNxtStep right">\r\n            <a class="buttonNavNext">\r\n              Kassan\r\n              <!-- Gå til kassen -->\r\n            </a>\r\n        </div>\r\n    </div>\r\n</div>\r\n';
 } 
__p+='\r\n\r\n';
 if(onCheckout) { 
__p+='\r\n<div class="orderDetails">\r\n  <div class="header_bullet">\r\n    <span>5</span>\r\n  </div>\r\n  <div class="checkoutHeadersLabel">\r\n    <h2>\r\n      Fattttttttt\r\n      <!-- Tjek din ordre -->\r\n    </h2>\r\n  </div>\r\n</div>\r\n';
 } 
__p+='\r\n\r\n<div class="basketDetailsBdy">\r\n    <div id="ec32">\r\n      <table class=\'HeaderBarTables ec32Table\'>\r\n        <tbody>\r\n          <tr class="HeaderBar ec32Head">\r\n            <td class="HeaderBar c1">Bild</td>\r\n            <td class="HeaderBar c3">Varenr.</td>\r\n            <td class="HeaderBar c4">Beskrivning</td>\r\n            <td class="HeaderBar c5">Antal</td>\r\n            <td class="HeaderBar c6">Pris</td>\r\n            <td class="HeaderBar c7">Rabatt</td>\r\n            <td class="HeaderBar c8">Pris</td>\r\n            ';
 if(!onCheckout) { 
__p+='\r\n              <td class="HeaderBar c9">Radera</td>\r\n            ';
 } 
__p+='\r\n          </tr>\r\n          ';
 _.each(lines, function(line, i) { 
__p+='\r\n            <tr class="row '+
((__t=( ((i % 2 != 0) ? 'rowOdd' : 'rowEven') ))==null?'':__t)+
'" >\r\n              <td class="content c1">\r\n                <a href=\''+
((__t=( line.itemUrl ))==null?'':__t)+
'\'>\r\n                  <img src=\''+
((__t=( line.itemImageUrl ))==null?'':__t)+
'\' style="display:inline-block;height:250px;width:250px;">\r\n                </a>\r\n              </td>\r\n              <td class="content c3">\r\n                <a href=\''+
((__t=( line.itemUrl ))==null?'':__t)+
'\'>\r\n                  '+
((__t=( line.externalItemId1 ))==null?'':__t)+
'\r\n                </a>\r\n              </td>\r\n              <td class="content c4">\r\n                <a href=\''+
((__t=( line.itemUrl ))==null?'':__t)+
'\'>\r\n                  '+
((__t=( line.description1 ))==null?'':__t)+
'\r\n                </a>\r\n              </td>\r\n              <td class="content c5">\r\n                ';
 if(onCheckout || line.notUpdatable) { 
__p+='\r\n                  <span>\r\n                    '+
((__t=( line.quantity ))==null?'':__t)+
'\r\n                  </span>\r\n                ';
 } else { 
__p+='\r\n                  <div class="shoppingCartInputContainer">\r\n                    <input class=\'shoppingCartInput\' type=\'text\' name=\'name\' value=\''+
((__t=( line.quantity ))==null?'':__t)+
'\' data-lineid=\''+
((__t=( line.id ))==null?'':__t)+
'\' >\r\n                    ';
 if(line.jpl && line.jpl.bundleSize > 0) { 
__p+='\r\n                      <div class="product-basket-crs-controls">\r\n                        <div class="product-basket-crs-add">\r\n                          <i class="zmdi zmdi-caret-up"></i>\r\n                        </div>\r\n                        <div class="product-basket-crs-sub">\r\n                          <i class="zmdi zmdi-caret-down"></i>\r\n                        </div>\r\n                      </div>\r\n                    ';
 } 
__p+='\r\n                  </div>\r\n                ';
 } 
__p+='\r\n                '+
((__t=( line.userCode3 ))==null?'':__t)+
'\r\n              </td>\r\n              <td class="content c6">\r\n                <a href=\''+
((__t=( line.itemUrl ))==null?'':__t)+
'\'>\r\n                  '+
((__t=( helpers.formatMoney(line.unitPrice.priceIncVat, currency) ))==null?'':__t)+
'\r\n                </a>\r\n              </td>\r\n              <td class="content c8">\r\n                <a href=\''+
((__t=( line.itemUrl ))==null?'':__t)+
'\'>\r\n                  '+
((__t=( helpers.formatMoney(line.lineAmount.priceIncVat, currency) ))==null?'':__t)+
'\r\n                </a>\r\n              </td>\r\n              ';
 if(!onCheckout) { 
__p+='\r\n              <td class="content c9">\r\n              	';
 if(line.itemContent !== 'Coupon') { 
__p+='\r\n	                <img src="/media/316/img/delete-icon.png"\r\n	                  alt="Delete item" style="display:inline-block;height:22px;width:22px;" onclick="basketUI.deleteItem( '+
((__t=( line.id ))==null?'':__t)+
' )"/>\r\n              	';
 } else { 
__p+=' \r\n              		<a href="/basket/shoppingcart.aspx?ce32cmd=remove&ce32lid='+
((__t=( line.id ))==null?'':__t)+
'">\r\n              			<img src="/media/316/img/delete-icon.png"\r\n	                  alt="Delete item" style="display:inline-block;height:22px;width:22px;"/>\r\n              		</a>\r\n              	';
 } 
__p+='\r\n              </td>\r\n              ';
 } 
__p+='\r\n            </tr>\r\n            ';
 }); 
__p+='\r\n          </tbody>\r\n        </table>\r\n\r\n    </div>\r\n</div>\r\n';
}
return __p;
}
 });
var templates = templates || {};
$.extend(templates, { 
shoppingCartTotals: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="basketTotalsBdy right clearfix">\r\n  <div id="ec38">\r\n    <table class="ec38TableTotals">\r\n      <tbody>\r\n        <tr class="ec38Subtotal">\r\n          <td class="content c1">\r\n            '+
((__t=( labels.subTotal ))==null?'':__t)+
'\r\n            <!-- Subtotal -->\r\n          </td>\r\n          <td class="content c2">\r\n            <span>'+
((__t=( helpers.formatMoney(basket.lineTotal.priceIncVat, currency) ))==null?'':__t)+
'</span>\r\n          </td>\r\n        </tr>\r\n        ';
 _.each(basket.fees, function(fee) { 
__p+='\r\n          ';
 if(fee.fee.priceIncVat != 0) { 
__p+='\r\n            <tr class="ec38Shipment">\r\n              <td class="content c1">\r\n                '+
((__t=( fee.name ))==null?'':__t)+
' - '+
((__t=( fee.description ))==null?'':__t)+
'\r\n              </td>\r\n              <td class="content c2">\r\n                '+
((__t=( helpers.formatMoney(fee.fee.priceIncVat, currency) ))==null?'':__t)+
'\r\n              </td>\r\n            </tr>\r\n            ';
 } 
__p+='\r\n            ';
 }); 
__p+='\r\n            <tr class="HeaderBar ec38Total">\r\n              <td class="content c1">\r\n                '+
((__t=( labels.total ))==null?'':__t)+
'\r\n                <!-- Total -->\r\n              </td>\r\n              <td class="content c2">\r\n                '+
((__t=( helpers.formatMoney(basket.basketTotal.priceIncVat, currency) ))==null?'':__t)+
'\r\n              </td>\r\n            </tr>\r\n            <tr class="ec38Tax">\r\n              <td class="content c1">\r\n                '+
((__t=( labels.ofWhichVat ))==null?'':__t)+
'\r\n                <!-- heraf moms -->\r\n              </td>\r\n              <td class="content c2">\r\n                '+
((__t=( helpers.formatMoney(basket.basketTotal.vatAmount, currency) ))==null?'':__t)+
'\r\n              </td>\r\n            </tr>\r\n          </tbody>\r\n        </table>\r\n  </div>\r\n</div>\r\n';
}
return __p;
}
 });