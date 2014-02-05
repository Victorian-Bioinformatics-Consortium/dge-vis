(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){require("./lib/jquery.multiselect.min.js");require("./config.coffee")},{"./config.coffee":2,"./lib/jquery.multiselect.min.js":3}],2:[function(require,module,exports){var asRows,col_id,column_keys,common_prefix,conditions_to_settings,create_condition_widget,csv_or_tab,data,del_condition_widget,grid,init,init_page,init_table,mod_settings,reset_settings,save,script,set_guess_type,set_multi_select,update_analyze_server_side,update_data,update_table,valid_int,view_url,warnings,__slice=[].slice,__indexOf=[].indexOf||function(item){for(var i=0,l=this.length;i<l;i++){if(i in this&&this[i]===item)return i}return-1};script=function(params){return"r-json.cgi?code="+window.my_code+(params?"&"+params:"")};view_url=function(){return"compare.html?code="+window.my_code};mod_settings=null;reset_settings=function(){return mod_settings=$.extend(true,{},settings)};data=null;grid=null;asRows=null;column_keys=null;init_table=function(){var options;options={enableCellNavigation:false,enableColumnReorder:false,multiColumnSort:false,forceFitColumns:true};grid=new Slick.Grid("#grid",[],[],options);return update_data()};csv_or_tab=function(){return $(".fmt:checked").val()};warnings=function(){var el;el=$("#fdr-column").siblings(".text-error");el.text("");if(!mod_settings.analyze_server_side&&!mod_settings.fdr_column){$(el).text("You must specify the False Discovery Rate column")}el=$("#avg-column").siblings(".text-error");el.text("");if(!mod_settings.analyze_server_side&&!mod_settings.avg_column){return $(el).text("You must specify the Average Expression column")}};valid_int=function(str){return str!==""&&parseInt(str).toString()===str};save=function(ev){ev.preventDefault();mod_settings.name=$("input.name").val();mod_settings.primary_name=$("input.primary").val();conditions_to_settings();mod_settings.csv_format=csv_or_tab()==="CSV";if(valid_int($("input.min-counts").val())){mod_settings.min_counts=parseInt($("input.min-counts").val())}else{delete mod_settings.min_counts}$("#saving-modal").modal({backdrop:"static",keyboard:false});$("#saving-modal .modal-body").html("Saving...");$("#saving-modal .modal-footer").hide();return $.ajax({type:"POST",url:script("query=save"),data:{settings:JSON.stringify(mod_settings)},dataType:"json"}).done(function(x){$("#saving-modal .modal-body").html("Save successful.");return $("#saving-modal .view").show()}).fail(function(x){log_error("ERROR",x);$("#saving-modal .modal-body").html("Failed!");return $("#saving-modal .view").hide()}).always(function(){$("#saving-modal").modal({backdrop:true,keyboard:true});$("#saving-modal .modal-footer").show();return $("#saving-modal #close-modal").click(function(){return window.location=window.location})})};col_id=function(n){return column_keys.indexOf(n)};set_multi_select=function(el,opts,selected){selected||(selected=[]);$(el).html(opts);$.each(selected,function(i,col){return $("option[value='"+col_id(col)+"']",el).attr("selected","selected")});return $(el).multiselect("refresh")};update_data=function(){var lst,n,opts,r,_i,_len,_ref,_ref1;if(!data){return}$("input.name").val(mod_settings.name||"");$(".exp-name").text(mod_settings.name||"Unnamed");$("input.primary").val(mod_settings.primary_name||"");if(mod_settings.hasOwnProperty("min_counts")){$("input.min-counts").val(mod_settings.min_counts)}asRows=null;switch(csv_or_tab()){case"TAB":asRows=d3.tsv.parseRows(data);break;case"CSV":asRows=d3.csv.parseRows(data);break;default:asRows=[]}_ref=asRows,column_keys=_ref[0],asRows=2<=_ref.length?__slice.call(_ref,1):[];opts="";$.each(column_keys,function(i,col){return opts+="<option value='"+i+"'>"+col+"</option>"});$("select.ec-column").html("<option value='-1'>--- Optional ---</option>"+opts);if(mod_settings.hasOwnProperty("ec_column")){$("select.ec-column option[value='"+col_id(mod_settings.ec_column)+"']").attr("selected","selected")}$("select#fdr-column").html(opts);$("select#fdr-column").html("<option value='-1'>--- Required ---</option>"+opts);if(mod_settings.fdr_column){$("select#fdr-column option[value='"+col_id(mod_settings.fdr_column)+"']").attr("selected","selected")}$("select#avg-column").html(opts);$("select#avg-column").html("<option value='-1'>--- Required ---</option>"+opts);if(mod_settings.avg_column){$("select#avg-column option[value='"+col_id(mod_settings.avg_column)+"']").attr("selected","selected")}set_multi_select($("select.info-columns"),opts,mod_settings.info_columns);set_multi_select($("select#hide-columns"),opts,mod_settings.hide_columns);set_multi_select($("select.fc-columns"),opts,mod_settings.fc_columns);update_table();$(".condition:not(.template)").remove();_ref1=mod_settings.replicates;for(_i=0,_len=_ref1.length;_i<_len;_i++){r=_ref1[_i];n=r[0],lst=r[1];create_condition_widget(n||"Unknown",lst,__indexOf.call(mod_settings["init_select"]||[],n)>=0)}$("#analyze-server-side").prop("checked",mod_settings.analyze_server_side);return update_analyze_server_side()};update_table=function(){var columns;mod_settings.hide_columns||(mod_settings.hide_columns=[]);columns=column_keys.filter(function(key,i){return __indexOf.call(mod_settings.hide_columns,i)<0}).map(function(key,i){return{id:key,name:key,field:i,sortable:false}});$("#grid-info").text("Number of columns = "+columns.length);grid.setColumns(columns);grid.setData(asRows);grid.updateRowCount();grid.render();return warnings()};set_guess_type=function(){if(data.split("	").length>20){return $("#fmt-tab").attr("checked","checked")}else{return $("#fmt-csv").attr("checked","checked")}};create_condition_widget=function(name,selected,is_init){var cond,opts;cond=$(".condition.template").clone(true);cond.removeClass("template");if(name){$("input.col-name",cond).val(name)}opts="";$.each(column_keys,function(i,col){var sel;sel=__indexOf.call(selected,col)>=0?'selected="selected"':"";return opts+="<option value='"+i+"' "+sel+">"+col+"</option>"});$("select.columns",cond).html(opts);$("select.columns",cond).multiselect({noneSelectedText:"-- None selected --",selectedList:4});$(".init-select input",cond).prop("checked",is_init);$(".condition-group").append(cond);$("select",cond).change(function(){var inp,lst;inp=$("input.col-name",cond);if(inp.val()===""||!inp.data("edited")){lst=[];$("select.columns option:selected",cond).each(function(j,opt){var n;n=column_keys[$(opt).val()];return lst.push(n)});return inp.val(common_prefix(lst))}});$("input.col-name",cond).data("edited",false);$("input.col-name",cond).change(function(){var inp;inp=$("input.col-name",cond);return inp.data("edited",inp.val()!=="")});return cond};common_prefix=function(lst){var s,tem1,tem2;lst=lst.slice(0).sort();tem1=lst[0];s=tem1.length;tem2=lst.pop();while(s&&tem2.indexOf(tem1)===-1){tem1=tem1.substring(0,--s)}return tem1};del_condition_widget=function(e){return $(e.target).parents(".condition").remove()};conditions_to_settings=function(){var c,init_select;c=[];init_select=[];$(".condition:not(.template)").each(function(i,e){var lst,name;lst=[];$("select.columns option:selected",e).each(function(j,opt){return lst.push(column_keys[+$(opt).val()])});name=$(".col-name",e).val()||"Cond "+(i+1);c.push([name,lst]);if($(".init-select input",e).is(":checked")){return init_select.push(name)}});mod_settings.replicates=c;return mod_settings.init_select=init_select};update_analyze_server_side=function(){var server_side;server_side=$("#analyze-server-side").is(":checked");$(".server-side-analysis-fields").toggle(server_side);$(".user-analysed-fields").toggle(!server_side);return mod_settings.analyze_server_side=server_side};init_page=function(){reset_settings();d3.text(script("query=partial_csv"),"text/csv",function(err,dat){if(err){$("div.container").text("ERROR : "+err);return}data=dat;set_guess_type();return init_table()});$("input.fmt").click(update_data);$("#save").click(save);$("#cancel").click(function(){reset_settings();return update_data()});$(".view").attr("href",view_url());$("select.ec-column").change(function(){mod_settings.ec_column=+$("select.ec-column option:selected").val();if(mod_settings.ec_column===-1){delete mod_settings.ec_column}else{mod_settings.ec_column=column_keys[mod_settings.ec_column]}return warnings()});$("select.info-columns").change(function(){var info;info=[];$("select.info-columns option:selected").each(function(i,e){return info.push(column_keys[+$(e).val()])});return mod_settings.info_columns=info});$("select.info-columns").multiselect({noneSelectedText:"-- None selected --",selectedList:4});$("select#hide-columns").change(function(){var hide;hide=[];$("select#hide-columns option:selected").each(function(i,e){return hide.push(column_keys[+$(e).val()])});mod_settings.hide_columns=hide;return update_table()});$("select#hide-columns").multiselect({noneSelectedText:"-- None selected --",selectedList:4});$("#add-condition").click(function(){var w;w=create_condition_widget("",[]);if($(".condition:not(.template)").length<=2){return $(".init-select input",w).prop("checked",true)}});$(".del-condition").click(del_condition_widget);$("#analyze-server-side").change(update_analyze_server_side);$("select#fdr-column").change(function(){var v;v=+$("select#fdr-column option:selected").val();mod_settings.fdr_column=v===-1?"":column_keys[v];return warnings()});$("select#avg-column").change(function(){var v;v=+$("select#avg-column option:selected").val();mod_settings.avg_column=v===-1?"":column_keys[v];return warnings()});$("select.fc-columns").change(function(){var fc_cols;fc_cols=[];$("select.fc-columns option:selected").each(function(i,e){return fc_cols.push(column_keys[+$(e).val()])});return mod_settings.fc_columns=fc_cols});return $("select.fc-columns").multiselect({noneSelectedText:"-- None selected --",selectedList:4})};init=function(){var code;code=get_url_vars()["code"];if(code==null){return log_error("No code defined")}else{window.my_code=code;return $.ajax({type:"GET",url:script("query=settings"),dataType:"json"}).done(function(json){window.settings=json;return init_page()}).fail(function(x){return log_error("Failed to get settings!",x)})}};$(document).ready(function(){return setup_nav_bar()});$(document).ready(function(){return init()});$(document).ready(function(){return $("[title]").tooltip()})},{}],3:[function(require,module,exports){(function(d){var k=0;d.widget("ech.multiselect",{options:{header:!0,height:175,minWidth:225,classes:"",checkAllText:"Check all",uncheckAllText:"Uncheck all",noneSelectedText:"Select options",selectedText:"# selected",selectedList:0,show:null,hide:null,autoOpen:!1,multiple:!0,position:{}},_create:function(){var a=this.element.hide(),b=this.options;this.speed=d.fx.speeds._default;this._isOpen=!1;a=(this.button=d('<button type="button"><span class="ui-icon ui-icon-triangle-2-n-s"></span></button>')).addClass("ui-multiselect ui-widget ui-state-default ui-corner-all").addClass(b.classes).attr({title:a.attr("title"),"aria-haspopup":!0,tabIndex:a.attr("tabIndex")}).insertAfter(a);(this.buttonlabel=d("<span />")).html(b.noneSelectedText).appendTo(a);var a=(this.menu=d("<div />")).addClass("ui-multiselect-menu ui-widget ui-widget-content ui-corner-all").addClass(b.classes).appendTo(document.body),c=(this.header=d("<div />")).addClass("ui-widget-header ui-corner-all ui-multiselect-header ui-helper-clearfix").appendTo(a);(this.headerLinkContainer=d("<ul />")).addClass("ui-helper-reset").html(function(){return!0===b.header?'<li><a class="ui-multiselect-all" href="#"><span class="ui-icon ui-icon-check"></span><span>'+b.checkAllText+'</span></a></li><li><a class="ui-multiselect-none" href="#"><span class="ui-icon ui-icon-closethick"></span><span>'+b.uncheckAllText+"</span></a></li>":"string"===typeof b.header?"<li>"+b.header+"</li>":""}).append('<li class="ui-multiselect-close"><a href="#" class="ui-multiselect-close"><span class="ui-icon ui-icon-circle-close"></span></a></li>').appendTo(c);(this.checkboxContainer=d("<ul />")).addClass("ui-multiselect-checkboxes ui-helper-reset").appendTo(a);this._bindEvents();this.refresh(!0);b.multiple||a.addClass("ui-multiselect-single")},_init:function(){!1===this.options.header&&this.header.hide();this.options.multiple||this.headerLinkContainer.find(".ui-multiselect-all, .ui-multiselect-none").hide();this.options.autoOpen&&this.open();this.element.is(":disabled")&&this.disable()},refresh:function(a){var b=this.element,c=this.options,f=this.menu,h=this.checkboxContainer,g=[],e="",i=b.attr("id")||k++;b.find("option").each(function(b){d(this);var a=this.parentNode,f=this.innerHTML,h=this.title,k=this.value,b="ui-multiselect-"+(this.id||i+"-option-"+b),l=this.disabled,n=this.selected,m=["ui-corner-all"],o=(l?"ui-multiselect-disabled ":" ")+this.className,j;"OPTGROUP"===a.tagName&&(j=a.getAttribute("label"),-1===d.inArray(j,g)&&(e+='<li class="ui-multiselect-optgroup-label '+a.className+'"><a href="#">'+j+"</a></li>",g.push(j)));l&&m.push("ui-state-disabled");n&&!c.multiple&&m.push("ui-state-active");e+='<li class="'+o+'">';e+='<label for="'+b+'" title="'+h+'" class="'+m.join(" ")+'">';e+='<input id="'+b+'" name="multiselect_'+i+'" type="'+(c.multiple?"checkbox":"radio")+'" value="'+k+'" title="'+f+'"';n&&(e+=' checked="checked"',e+=' aria-selected="true"');l&&(e+=' disabled="disabled"',e+=' aria-disabled="true"');e+=" /><span>"+f+"</span></label></li>"});h.html(e);this.labels=f.find("label");this.inputs=this.labels.children("input");this._setButtonWidth();this._setMenuWidth();this.button[0].defaultValue=this.update();a||this._trigger("refresh")},update:function(){var a=this.options,b=this.inputs,c=b.filter(":checked"),f=c.length,a=0===f?a.noneSelectedText:d.isFunction(a.selectedText)?a.selectedText.call(this,f,b.length,c.get()):/\d/.test(a.selectedList)&&0<a.selectedList&&f<=a.selectedList?c.map(function(){return d(this).next().html()}).get().join(", "):a.selectedText.replace("#",f).replace("#",b.length);this.buttonlabel.html(a);return a},_bindEvents:function(){function a(){b[b._isOpen?"close":"open"]();return!1}var b=this,c=this.button;c.find("span").bind("click.multiselect",a);c.bind({click:a,keypress:function(a){switch(a.which){case 27:case 38:case 37:b.close();break;case 39:case 40:b.open()}},mouseenter:function(){c.hasClass("ui-state-disabled")||d(this).addClass("ui-state-hover")},mouseleave:function(){d(this).removeClass("ui-state-hover")},focus:function(){c.hasClass("ui-state-disabled")||d(this).addClass("ui-state-focus")},blur:function(){d(this).removeClass("ui-state-focus")}});this.header.delegate("a","click.multiselect",function(a){if(d(this).hasClass("ui-multiselect-close"))b.close();else b[d(this).hasClass("ui-multiselect-all")?"checkAll":"uncheckAll"]();a.preventDefault()});this.menu.delegate("li.ui-multiselect-optgroup-label a","click.multiselect",function(a){a.preventDefault();var c=d(this),g=c.parent().nextUntil("li.ui-multiselect-optgroup-label").find("input:visible:not(:disabled)"),e=g.get(),c=c.parent().text();!1!==b._trigger("beforeoptgrouptoggle",a,{inputs:e,label:c})&&(b._toggleChecked(g.filter(":checked").length!==g.length,g),b._trigger("optgrouptoggle",a,{inputs:e,label:c,checked:e[0].checked}))}).delegate("label","mouseenter.multiselect",function(){d(this).hasClass("ui-state-disabled")||(b.labels.removeClass("ui-state-hover"),d(this).addClass("ui-state-hover").find("input").focus())}).delegate("label","keydown.multiselect",function(a){a.preventDefault();switch(a.which){case 9:case 27:b.close();break;case 38:case 40:case 37:case 39:b._traverse(a.which,this);break;case 13:d(this).find("input")[0].click()}}).delegate('input[type="checkbox"], input[type="radio"]',"click.multiselect",function(a){var c=d(this),g=this.value,e=this.checked,i=b.element.find("option");this.disabled||!1===b._trigger("click",a,{value:g,text:this.title,checked:e})?a.preventDefault():(c.focus(),c.attr("aria-selected",e),i.each(function(){this.value===g?this.selected=e:b.options.multiple||(this.selected=!1)}),b.options.multiple||(b.labels.removeClass("ui-state-active"),c.closest("label").toggleClass("ui-state-active",e),b.close()),b.element.trigger("change"),setTimeout(d.proxy(b.update,b),10))});d(document).bind("mousedown.multiselect",function(a){b._isOpen&&!d.contains(b.menu[0],a.target)&&!d.contains(b.button[0],a.target)&&a.target!==b.button[0]&&b.close()});d(this.element[0].form).bind("reset.multiselect",function(){setTimeout(d.proxy(b.refresh,b),10)})},_setButtonWidth:function(){var a=this.element.outerWidth(),b=this.options;/\d/.test(b.minWidth)&&a<b.minWidth&&(a=b.minWidth);this.button.width(a)},_setMenuWidth:function(){var a=this.menu,b=this.button.outerWidth()-parseInt(a.css("padding-left"),10)-parseInt(a.css("padding-right"),10)-parseInt(a.css("border-right-width"),10)-parseInt(a.css("border-left-width"),10);a.width(b||this.button.outerWidth())},_traverse:function(a,b){var c=d(b),f=38===a||37===a,c=c.parent()[f?"prevAll":"nextAll"]("li:not(.ui-multiselect-disabled, .ui-multiselect-optgroup-label)")[f?"last":"first"]();c.length?c.find("label").trigger("mouseover"):(c=this.menu.find("ul").last(),this.menu.find("label")[f?"last":"first"]().trigger("mouseover"),c.scrollTop(f?c.height():0))},_toggleState:function(a,b){return function(){this.disabled||(this[a]=b);b?this.setAttribute("aria-selected",!0):this.removeAttribute("aria-selected")}},_toggleChecked:function(a,b){var c=b&&b.length?b:this.inputs,f=this;c.each(this._toggleState("checked",a));c.eq(0).focus();this.update();var h=c.map(function(){return this.value}).get();this.element.find("option").each(function(){!this.disabled&&-1<d.inArray(this.value,h)&&f._toggleState("selected",a).call(this)});c.length&&this.element.trigger("change")},_toggleDisabled:function(a){this.button.attr({disabled:a,"aria-disabled":a})[a?"addClass":"removeClass"]("ui-state-disabled");var b=this.menu.find("input"),b=a?b.filter(":enabled").data("ech-multiselect-disabled",!0):b.filter(function(){return!0===d.data(this,"ech-multiselect-disabled")}).removeData("ech-multiselect-disabled");b.attr({disabled:a,"arial-disabled":a}).parent()[a?"addClass":"removeClass"]("ui-state-disabled");this.element.attr({disabled:a,"aria-disabled":a})},open:function(){var a=this.button,b=this.menu,c=this.speed,f=this.options,h=[];if(!(!1===this._trigger("beforeopen")||a.hasClass("ui-state-disabled")||this._isOpen)){var g=b.find("ul").last(),e=f.show,i=a.offset();d.isArray(f.show)&&(e=f.show[0],c=f.show[1]||this.speed);e&&(h=[e,c]);g.scrollTop(0).height(f.height);d.ui.position&&!d.isEmptyObject(f.position)?(f.position.of=f.position.of||a,b.show().position(f.position).hide()):b.css({top:i.top+a.outerHeight(),left:i.left});d.fn.show.apply(b,h);this.labels.eq(0).trigger("mouseover").trigger("mouseenter").find("input").trigger("focus");a.addClass("ui-state-active");this._isOpen=!0;this._trigger("open")}},close:function(){if(!1!==this._trigger("beforeclose")){var a=this.options,b=a.hide,c=this.speed,f=[];d.isArray(a.hide)&&(b=a.hide[0],c=a.hide[1]||this.speed);b&&(f=[b,c]);d.fn.hide.apply(this.menu,f);this.button.removeClass("ui-state-active").trigger("blur").trigger("mouseleave");this._isOpen=!1;this._trigger("close")}},enable:function(){this._toggleDisabled(!1)},disable:function(){this._toggleDisabled(!0)},checkAll:function(){this._toggleChecked(!0);this._trigger("checkAll")},uncheckAll:function(){this._toggleChecked(!1);this._trigger("uncheckAll")},getChecked:function(){return this.menu.find("input").filter(":checked")},destroy:function(){d.Widget.prototype.destroy.call(this);this.button.remove();this.menu.remove();this.element.show();return this},isOpen:function(){return this._isOpen},widget:function(){return this.menu},getButton:function(){return this.button},_setOption:function(a,b){var c=this.menu;switch(a){case"header":c.find("div.ui-multiselect-header")[b?"show":"hide"]();break;case"checkAllText":c.find("a.ui-multiselect-all span").eq(-1).text(b);break;case"uncheckAllText":c.find("a.ui-multiselect-none span").eq(-1).text(b);break;case"height":c.find("ul").last().height(parseInt(b,10));break;case"minWidth":this.options[a]=parseInt(b,10);this._setButtonWidth();this._setMenuWidth();break;case"selectedText":case"selectedList":case"noneSelectedText":this.options[a]=b;this.update();break;case"classes":c.add(this.button).removeClass(this.options.classes).addClass(b);break;case"multiple":c.toggleClass("ui-multiselect-single",!b),this.options.multiple=b,this.element[0].multiple=b,this.refresh()}d.Widget.prototype._setOption.apply(this,arguments)}})})(jQuery)},{}]},{},[1]);