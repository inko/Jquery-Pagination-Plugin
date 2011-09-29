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
	$.fn.pagination = function( settings ) {
		
		// настройки по умолчанию
		var defaults = {
			itemsContainerClass : 'items',
			itemClass : 'item',
			navigationContainerClass : 'navigation',
			navigationItemClass : 'nav',
			currentClass : 'current',
			countOnPage : 3
		};
		var settings = $.extend( defaults, settings );

		return $(this).each(function(){
			var $container = $(this);
			// найти элементы страниц
			var $pageItems  = getPagesItems( $container, settings.itemsContainerClass, settings.itemClass );
			var pagesItemsCount = $pageItems.length;
			var pagesCount = getPagesCount( pagesItemsCount, settings.countOnPage );
			
			// отобразить навигацию
			for( var index=1; index<=pagesCount; index++ ) {
				var firstClass = (index == 1 ) ? settings.currentClass : '';
				$container.find('.'+settings.navigationContainerClass).append('<div class="'+firstClass+' '+settings.navigationItemClass+'"><a href="#">'+index+'</a></div>');
			}
			var $navigationItems  = getNavigationItems( $container, settings.navigationContainerClass, settings.navigationItemClass );
			
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
				for( var i = startIndex; i<=endIndex; i++){
					$pageItems.eq(i).addClass(settings.currentClass);
				}
				
				$navigationItems.filter( '.'+settings.currentClass).removeClass(settings.currentClass);
				$navigationItem.addClass(settings.currentClass);
				
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