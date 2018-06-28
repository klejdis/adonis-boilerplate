$(document).ready(function(){

    $.ajaxSetup({
        cache: false,
        headers: {
            "X-CSRF-TOKEN": $("meta[name=\"csrf-token\"]").attr("content")
        }
    });


});

/**
 * --------------------------------------------------------------------------
 * CUSTOM HELPER UTILS AJAX MODAL MODULE
 */
var AjaxModalBundle = (function ($) {

    // Will be true if bootstrap is loaded, false otherwise
    var bootstrap_enabled = (typeof $().modal == "function");

    if(!bootstrap_enabled){
        console.error("BOOTSTRAP MODAL COMPONENT IS REQUIRED");
        return false;
    }

    //CONSTANTS
    var MODAL_ID = "ajax_modal";
    var DATA_KEY = "ajax.bs.modal";

    var Default = {
        large : false ,
        title : "Modal Title",
        url : "",
        show : true,
        backdrop : "static",
        keyboard: true,
        show: true
    };

    var Selector = {
        DATA_TOGGLE : "[data-toggle=ajax-modal]",
        MODAL_ID : "ajaxModal",
        CONTENT_WRAPPER_ID : "#ajaxModalOriginalContent",
        MODAL_TITLE_ID : "ajaxModalTitle",
        MODAL_CONTENT_ID : "ajaxModalContent"
    };

    /**
     * ------------------------------------------------------------------------
     * AJAX MODAL HTML TEMPLATE
     * ------------------------------------------------------------------------
     */

    var tpl = `
                <!-- Modal -->
                <div class="modal" id="${Selector.MODAL_ID}" tabindex="-1">
                    <div class="modal-dialog modal-simple">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" id="${Selector.MODAL_TITLE_ID}" data-title="App Title"></h4>

                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                
                            <!--CONTENT OF MODAL WILL BE INJECTED HERE-->
                            <div id="${Selector.MODAL_CONTENT_ID}">
                                <!--CONTENT OF MODAL WILL BE INJECTED HERE-->
                            </div>
                
                            <div id='ajaxModalOriginalContent' style="display: none!important;">
                                <div class="original-modal-body">
                                    <div class="h-150 vertical-align text-center">
                                        <div class="loader vertical-align-middle loader-grill"></div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End Modal -->
    `;


    /**
     * ------------------------------------------------------------------------
     * AJAX MODAL METHODS
     * ------------------------------------------------------------------------
     */

    init = function () {
        renderHtml();
        abortAjaxHandler();
    };

    mask = function () {
        $maskTarget = $("#" + Selector.MODAL_CONTENT_ID);

        var padding = $maskTarget.height() - 80;

        if (padding > 0) {
            padding = Math.floor(padding / 2);
        }

        $maskTarget.append("<div class='modal-mask' style='position: absolute;top: 0;left: 0; background: rgba(255,255,255,.5);z-index: 99999'><div class=\"h-150 vertical-align text-center\">\n" +
            "<div class=\"loader vertical-align-middle loader-grill\"></div>\n" +
            "</div></div>");

        //check scrollbar
        var height =  $maskTarget.outerHeight();

        //console.log($maskTarget.height());
        //console.log($maskTarget.outerHeight());

        $(".modal-mask").css({"width": $maskTarget.width() + "px", "height": height + "px", "padding-top": padding + "px"});

        disableFooterSubmitBtn();
    };

    disableFooterSubmitBtn = function () {
        $modalFooter = $("#" + Selector.MODAL_ID).find(".modal-footer [type=\"submit\"]").each(function () {
            $(this).attr("disabled" , "disabled");
        });
    };

    unmask = function () {
        var $maskTarget = $(".modal-body");
        $maskTarget.closest(".modal-dialog").find("[type=\"submit\"]").removeAttr("disabled");
        $(".modal-mask").remove();
    };

    renderHtml = function () {
        $("body").append(tpl);
    };

    show = function (config) {
        setTitle(config.title);
        setModalSize(config.large);
        setInitialContent();
        setBackdropCloseHander(config.closeOnBackClick);
        loadContent(config.url, config.data);

        $("#"+Selector.MODAL_ID).modal(config);
    };

    close = function () {
        $("#"+Selector.MODAL_ID).modal("hide");
    };

    setBackdropCloseHander = function (close) {

    };

    setTitle  = function (title) {
        if(title != ""){
            $("#"+Selector.MODAL_TITLE_ID).html(title);
        }
    };

    setModalSize = function (isLargeModal) {
        $("#" + Selector.MODAL_ID).find(".modal-dialog").removeClass("mini-modal");
        if (isLargeModal === "1") {
            $("#" + Selector.MODAL_ID).find(".modal-dialog").addClass("modal-lg");
        }
    };

    setInitialContent = function () {
        $("#"+Selector.MODAL_CONTENT_ID).html($("#ajaxModalOriginalContent").html());//initial content is loader
        $("#"+Selector.MODAL_CONTENT_ID).find(".original-modal-body").removeClass("original-modal-body").addClass("modal-body");
    };

    setModalContentHtml = function (content) {
        $("#"+Selector.MODAL_CONTENT_ID).html(content);
    };

    abortAjaxHandler = function () {
        $("#" + Selector.MODAL_ID).on("hidden.bs.modal", function (e) {
            ajaxModalXhr.abort();
            $("#ajaxModal").find(".modal-dialog").removeClass("modal-lg");
            $("#ajaxModal").find(".modal-dialog").addClass("mini-modal");

            $("#ajaxModalContent").html("");
        });
    };

    loadContent = function (url,data) {
        ajaxModalXhr =$.ajax({
            url: url,
            data: data,
            cache: false,
            type: "POST",
            success: function (response) {
                if (response.code == "KO"){
                    toastr.error(response.message);
                    AjaxModalBundle.close();
                    return false;
                }

                setModalContentHtml(response);

                var $scroll = $("#ajaxModalContent").find(".modal-body"),
                    height = $scroll.height(),
                    maxHeight = $(window).height() - 200;
                if (height > maxHeight) {
                    height = maxHeight;
                    if ($.fn.mCustomScrollbar) {
                        $scroll.mCustomScrollbar({setHeight: height, theme: "minimal-dark", autoExpandScrollbar: true});
                    }
                }
            },
            statusCode: {
                404: function () {
                    $("#ajaxModalContent").find(".modal-body").html("");
                    toastr.error("404: Page not found.");
                },
                422 : function (msg) {
                    console.log(msg);
                }
            },
            error: function (msg) {
                $("#ajaxModalContent").find(".modal-body").html("");
                console.error(msg);
            }
        });
    };

    showSuccessAndClose = function(){
        var success_tpl = `
                    <div class='circle-done  btn-primary'><i class="md-check"></i></div>
                    
                    <style>
                        .circle-done {
                            margin:10px auto;
                            width: 120px;
                            height: 120px;
                            border-radius: 60px;
                            -webkit-box-sizing: border-box;
                            box-sizing: border-box;
                            text-align: center;
                            font-size: 65px;
                            padding: 10px;
                            color: #3c8dbc;
                        }
                        .circle-done i{
                            display: inline-block;
                            max-width: 0%;
                            overflow: hidden;
                            color: #FFFFFF;
                    
                        }
                        .circle-done.ok i{
                            max-width: 80%;
                            -webkit-transition:max-width 1000ms ease;
                            -moz-transition:max-width 1000ms ease;
                            -o-transition:max-width 1000ms ease;
                            transition:max-width 1000ms ease;
                        }
                    </style>`;

        $(".modal-mask").html(success_tpl);
        setTimeout(function () {
            $(".modal-mask").find(".circle-done").addClass("ok");

        }, 30);

        setTimeout(function () {
            AjaxModalBundle.close();
        }, 1000);


    };


    getConfig = function (config) {
        return $.extend({} , Default , config);
    };


    /**
     * ------------------------------------------------------------------------
     * ENABLE HTML5 DATA ATTRIBUTES
     * ------------------------------------------------------------------------
     */
    $(document).ready(function () {
        $(document).on("click" , Selector.DATA_TOGGLE , function (event) {

            data = {};

            //get post data
            $(this).each(function () {
                $.each(this.attributes, function () {
                    if (this.specified && this.name.match("^data-post-")) {
                        var dataName = this.name.replace("data-post-", "");
                        data[dataName] = this.value;
                    }
                });
            });

            var config = {
                large : $(this).attr("data-modal-lg"),
                title : $(this).attr("data-title"),
                url : $(this).attr("data-action-url"),
                backdrop : $(this).attr("data-backdrop"),
                keyboard : ($(this).attr("data-keyboard")) ? true : false,
                data : data,
            };

            show(getConfig(config));
        });
    });

    init();

    /**
     * EXPORT THE PUBLIC API
     */
    return {
        show : show,
        close : close,
        mask : mask,
        unmask : unmask,
        showSuccessAndClose : showSuccessAndClose
    };
})(jQuery);



