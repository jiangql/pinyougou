/*$(function(){
	$(".address").hover(function(){
		$(this).addClass("address-hover");	
	},function(){
		$(this).removeClass("address-hover");	
	});
})*/

$(function () {
	$(document).on("hover",".address",function () {
        $(".address").addClass("address-hover");
    },function () {
        $(".address").removeClass("address-hover");
    });
});

$(function(){
	$(".addr-item .name").click(function(){
		 $(this).toggleClass("selected").siblings().removeClass("selected");	
	});
	$(".payType li").click(function(){
		 $(this).toggleClass("selected").siblings().removeClass("selected");	
	});
})
