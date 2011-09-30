#HTML:
``` html
<div class="pages">
	<div class="items">
		<div class="item">item1</div>
		<div class="item">item2</div>
		<div class="item">item3</div>
	</div>
		<div class="item">item4</div>
	</div>
	<div class="navigation">
</div>
```
	
#CSS:
``` css
.pages .items .item {
	display:none;
}

.pages .items .item .current{
	display:block;
}

.pages .navigation .nav{
	float:left;
	width:30px;
	height:30px;
}

.pages .navigation .nav .current {
	border : 1px solid red;
}
```

#JS:
``` JavaScript
(function(){
	$(document).reay(function(){
		$('.pages').pagination();
	})
})(jQuery);
```