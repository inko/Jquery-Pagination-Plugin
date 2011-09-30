/*
	Copyright (c) 2011 Manyakhin Valentine

	Данная лицензия разрешает лицам, получившим копию данного программного 
	обеспечения и сопутствующей документации (в дальнейшем именуемыми 
	«Программное Обеспечение»), безвозмездно использовать Программное 
	Обеспечение без ограничений, включая неограниченное право на 
	использование, копирование, изменение, добавление, публикацию, 
	распространение, сублицензирование и/или продажу копий Программного 
	Обеспечения, также как и лицам, которым предоставляется данное 
	Программное Обеспечение, при соблюдении следующих условий:

	Указанное выше уведомление об авторском праве и данные условия должны 
	быть включены во все копии или значимые части данного Программного 
	Обеспечения.

	ДАННОЕ ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ», БЕЗ КАКИХ-ЛИБО 
	ГАРАНТИЙ, ЯВНО ВЫРАЖЕННЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ, ВКЛЮЧАЯ, НО НЕ 
	ОГРАНИЧИВАЯСЬ ГАРАНТИЯМИ ТОВАРНОЙ ПРИГОДНОСТИ, СООТВЕТСТВИЯ ПО ЕГО 
	КОНКРЕТНОМУ НАЗНАЧЕНИЮ И ОТСУТСТВИЯ НАРУШЕНИЙ ПРАВ. НИ В КАКОМ СЛУЧАЕ 
	АВТОРЫ ИЛИ ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ПО ИСКАМ О ВОЗМЕЩЕНИИ 
	УЩЕРБА, УБЫТКОВ ИЛИ ДРУГИХ ТРЕБОВАНИЙ ПО ДЕЙСТВУЮЩИМ КОНТРАКТАМ, ДЕЛИКТАМ 
	ИЛИ ИНОМУ, ВОЗНИКШИМ ИЗ, ИМЕЮЩИМ ПРИЧИНОЙ ИЛИ СВЯЗАННЫМ С ПРОГРАММНЫМ 
	ОБЕСПЕЧЕНИЕМ ИЛИ ИСПОЛЬЗОВАНИЕМ ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ ИЛИ ИНЫМИ 
	ДЕЙСТВИЯМИ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.
*/
/*
	Плагин управления переключением кладок.
	
	Пример использования.
	
	HTML:
	--------------------------------------------------------------------------
	<div class="pages">
		<div class="items">
			<div class="item">item1</div>
			<div class="item">item2</div>
			<div class="item">item3</div>
			<div class="item">item4</div>
		</div>
		<div class="navigation">
		</div>
	</div>
	
	CSS:
	--------------------------------------------------------------------------
	.pages .items .item {
		display:none;
	}
	
	.pages .items .item .current{
		display:block;
	}
	
	.pages .navigation .nav {
	
	}
	
	.pages .navigation .nav .current {
		border : 1px solid red;
	}
	
	.pages .navigation .nav{
		float:left;
		width:30px;
		height:30px;
	}
	

	JS:
	--------------------------------------------------------------------------
	(function(){
		$(document).reay(function(){
			$('.pages').pagination();
		})
	})(jQuery);
*/
"use strict";
"use strict";
(function($){

	// получить элементы страниц
	function getPagesItems( $container, pageItemsContainerClass, pageItemsClass ) {
		return $container.find( '.' + pageItemsContainerClass + ' .' + pageItemsClass );
	}
	// получить элементы навигации
	function getNavigationItems( $container, pageNavigationContainerClass, pageNavigationItemsClass ) {
		return $container.find( '.' + pageNavigationContainerClass + ' .' + pageNavigationItemsClass );
	}
	// получить кол-во страниц
	function getPagesCount( total, itemsOnPage ) {
		return Math.ceil( total / itemsOnPage );
	}
	
	// добавить страницу в конец
	function appendPage(pageContent){
		var $navigationItems  = getNavigationItems( this.container, this.settings.navigationContainerClass, this.settings.navigationItemClass );
		var $pageItems  = getPagesItems( this.container, this.settings.itemsContainerClass, this.settings.itemClass );
		var pagesCount = $pageItems.length;
		var navigationItemsCount = $navigationItems.length;
		// номер активной тсраницы
		var currentPageIndex = $navigationItems.filter( '.' + this.settings.currentClass ).index() +1;
		var currentPageClass = '';

		if( getPagesCount(pagesCount+1,this.settings.countOnPage) > getPagesCount(pagesCount,this.settings.countOnPage) ) {
			$navigationItems.parents( '.' + this.settings.navigationContainerClass ).first().append('<div class="'+this.settings.navigationItemClass+'"><a href="#">'+(navigationItemsCount+1)+'</a></div>');
		}
		
		if( currentPageIndex == getPagesCount(pagesCount+1,this.settings.countOnPage) ) {
			currentPageClass = this.settings.currentClass
		} 
		$pageItems.parents( '.' + this.settings.itemsContainerClass ).first().append('<div class="'+currentPageClass+' '+this.settings.itemClass+'">'+pageContent+'</div>');
	}
	
	// добавить страницу в начало
	function prependPage(pageContent){
		var $navigationItems  = getNavigationItems( this.container, this.settings.navigationContainerClass, this.settings.navigationItemClass );
		var $pageItems  = getPagesItems( this.container, this.settings.itemsContainerClass, this.settings.itemClass );
		var pagesCount = $pageItems.length;
		var navigationItemsCount = $navigationItems.length;

		if( getPagesCount(pagesCount+1,this.settings.countOnPage) > getPagesCount(pagesCount,this.settings.countOnPage) ) {
			$navigationItems.parents( '.' + this.settings.navigationContainerClass ).first().append('<div class="'+this.settings.navigationItemClass+'"><a href="#">'+(navigationItemsCount+1)+'</a></div>');
		}
		var endIndex = this.settings.countOnPage - 1;
		$pageItems.eq(endIndex).removeClass(this.settings.currentClass);
		$pageItems.parents( '.' + this.settings.itemsContainerClass ).first().prepend('<div class="'+this.settings.currentClass+' '+this.settings.itemClass+'">'+pageContent+'</div>');
		
		return this;
	}
	var apiDataAttributeName = 'pagination';
	var navigationOffest = 0;
	$.fn.pagination = function( settings ) {
		
		// настройки по умолчанию
		var defaults = {
			itemsContainerClass : 'items',
			itemClass : 'item',
			navigationContainerClass : 'navigation',
			navigationItemClass : 'nav',
			currentClass : 'current',
			countOnPage : 3,
			countNavigationItems:7
		};
		var settings = $.extend( defaults, settings );

		return $(this).each(function(){
			var $container = $(this);
			// найти элементы страниц
			var $pageItems  = getPagesItems( $container, settings.itemsContainerClass, settings.itemClass );
			var pagesItemsCount = $pageItems.length;
			var pagesCount = getPagesCount( pagesItemsCount, settings.countOnPage );
			
			// отобразить навигацию
			
			$container.find('.'+settings.navigationContainerClass).append('<div class="prev">&lt;&lt;</div>');
			for( var index=1; index<=pagesCount; index++ ) {
				var firstClass = (index == 1 ) ? settings.currentClass : '';
				$container.find('.'+settings.navigationContainerClass).append('<div class="'+firstClass+' '+settings.navigationItemClass+'"><a href="#">'+index+'</a></div>');
			}
			$container.find('.'+settings.navigationContainerClass).append('<div class="next">&gt;&gt;</div>');
			var $navigationItems  = getNavigationItems( $container, settings.navigationContainerClass, settings.navigationItemClass );
			for( var index=(settings.countNavigationItems); index<$navigationItems.length; index++) {
				$navigationItems.eq(index).hide();
			}
			for( var index=0; index<settings.countOnPage; index++ ) {
				$pageItems.eq(index).addClass( settings.currentClass );
			}
			

			
			// обработчик переключения страниц
			$navigationItems.live('click', function(event){
				event.preventDefault();
				var $navigationItem = $(this);
				var position = $navigationItem.index();
				
				var $pageItems  = getPagesItems( $container, settings.itemsContainerClass, settings.itemClass );
				var $navigationItems  = getNavigationItems( $container, settings.navigationContainerClass, settings.navigationItemClass );
				
				$pageItems.filter('.'+settings.currentClass).removeClass(settings.currentClass);
				
				var endIndex = ( position == 0  ) ? ( settings.countOnPage - 1 ) : ( position * settings.countOnPage + ( settings.countOnPage - 1 ) );

				var startIndex = ( position == 0  ) ? 0 : ( position * settings.countOnPage  );
				// console.info(startIndex, endIndex)
				for( var i = startIndex; i<=endIndex; i++){
					$pageItems.eq(i-1).addClass(settings.currentClass);
				}
				
				$navigationItems.filter( '.'+settings.currentClass).removeClass(settings.currentClass);
				$navigationItem.addClass(settings.currentClass);
				
			});
			
			$container.find('.next').bind('click',function(){
				var $navigationItems  = getNavigationItems( $container, settings.navigationContainerClass, settings.navigationItemClass );
				var next = navigationOffest+settings.countNavigationItems+1;
				var max = $navigationItems.length;
				if( next <= max ) {
					$navigationItems.eq( navigationOffest ).hide();
					$navigationItems.eq( navigationOffest + settings.countNavigationItems).show();
					navigationOffest = navigationOffest+1;
				}
			});
			$container.find('.prev').bind('click',function(){
				if( navigationOffest > 0 ) {
					var $navigationItems  = getNavigationItems( $container, settings.navigationContainerClass, settings.navigationItemClass );
					$navigationItems.eq( navigationOffest - 1 ).show();
					$navigationItems.eq( navigationOffest + settings.countNavigationItems -1).hide();
					navigationOffest = navigationOffest-1;
					if( navigationOffest < 0 ) navigationOffest = 0;
				}
	
			});
			
			// api
			$container.data(apiDataAttributeName,{
				settings : settings,
				appendPage : appendPage,
				prependPage : prependPage,
				container : $container
			});
			
		});
	};
})(jQuery)