jQuery(document).ready(function($) {
    

	$(function() {

		$("#stock")
			.focus()
			.autocomplete({
				source: function(request,response) {
					$.ajax({
						beforeSend: function(){ 
							//$("span.help-inline").show();
							$("span.label-info").empty().hide();
						},
						url: "http://dev.markitondemand.com/api/v2/Lookup/jsonp",
						dataType: "jsonp",
						data: {
							input: request.term
						},
						success: function(data) {
							response( $.map(data, function(item) {
								return {
									label: item.Name + " (" +item.Exchange+ ")",
									value: item.Symbol
								}
							}));
							$("span.help-inline").hide();
						}
					});
				},
				minLength: 0,
				select: function( event, ui ) {
					$("#txtName").val(ui.item.label);
					$("#symName").val(ui.item.value);
				},
				open: function() {
					//$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
				},
				close: function() {
					//$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				}
			})
		;
	});


});

