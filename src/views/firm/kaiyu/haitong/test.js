
//判断条件表达式的函数
function checkExpression(expression) {
  var sReturn = true;//表达式是否正确
  var tmpArray = [];
  var tmpWhere = "";
  var tmpWhere1 = "";
  var expressionReg = "";
  if (expression == null || expression.trim() == "") {
    sReturn = false;
    errorObj = {"表达式": ["不能为空"]};
    return sReturn;
  }
  $("input[name^='serialNo_']").each(function (i, v) {
    tmpArray.push($(this).val());
  });
  if (expression.match(/\d+\s+\d/ig)) {
    sReturn = false;
    errorObj = {"表达式": ["语法有误"]};
    return sReturn;
  }
  //判断做括号数是否与右括号数相同
  if (expression.match(/\(/ig) && expression.match(/\)/ig)) {
    if (expression.match(/\(/ig).length - expression.match(/\)/ig).length > 0) {
      sReturn = false;
      errorObj = {"表达式": ["缺失右括号"]};
      return sReturn;
    } else if (expression.match(/\(/ig).length - expression.match(/\)/ig).length < 0) {
      sReturn = false;
      errorObj = {"表达式": ["缺失左括号"]};

      return sReturn;
    }
  } else if (expression.match(/\(/ig) || expression.match(/\)/ig)) {
    if (expression.match(/\(/ig)) {
      sReturn = false;
      errorObj = {"表达式": ["缺失右括号"]};
      return sReturn;
    } else {
      sReturn = false;
      errorObj = {"表达式": ["缺失左括号"]};
      return sReturn;
    }
  }
  tmpWhere1 = expression.replace(/#/ig, "").replace(/\s+/g, "").replace(/AND/ig, '&').replace(/OR/ig, '|').trim();
  tmpWhere1 = '1+(' + tmpWhere1 + ')';
  try {
    eval(tmpWhere1);
  } catch (err) {
    sReturn = false;
    errorObj = {"表达式": ["语法有误"]};
    return sReturn;
  }
  tmpWhere = expression.replace(/#/ig, "").replace(/\s+/g, "").replace(/\(/g, "").replace(/\)/g, "").trim();

  expression = expression.replace(/\(/g, " ").replace(/\)/g, " ").replace(/AND/ig, " ").replace(/OR/ig, " ").replace(/>/ig, " ").replace(/=/ig, " ").replace(/</ig, " ").replace(/#/ig, " ").trim();
  if (expression.replace(/([0-9]+\s+)+[0-9]+|[0-9]+/g, '△') != '△') {
    sReturn = false;
    errorObj = {"表达式": ["含有非法或无效字符"]};
    return sReturn;
  }
  if (!tmpWhere.match(/^(\d+((AND|OR)|(=|>|<|>=|<=)))*\d+$/ig)) {
    sReturn = false;
    errorObj = {"表达式": ["语法有误"]};
    return sReturn;
  } else {
    tmpWhere = tmpWhere.replace(/(>=|<=)/g, "△").replace(/(>|<|=)/g, "△").replace(/\d/g, "");
    if (tmpWhere.match(/△{2,}/)) {
      sReturn = false;
      errorObj = {"表达式": ["不能出现连续的大小比较，请拆分"]};
      return sReturn;
    }
  }
  expression = expression.replace(/\s+/g, " ");
  var expressionArray = expression.split(" ");
  expressionArray = expressionArray.filter(function (element, index, self) {
    return self.indexOf(element) === index;
  });

  function compare(val1, val2) {
    return parseInt(val1.trim()) - parseInt(val2.trim());
  }
  expressionArray.sort(compare);
  tmpArray.sort(compare);
  var arr2 = expressionArray.filter(function (el) {
    return !~tmpArray.indexOf(el);
  });
  if (arr2.length > 0) {
    sReturn = false;
    errorObj = {"表达式": ["序号为" + arr2.join() + "的指标不存在"]};
    return sReturn;
  }
  return sReturn;

}

var marketCategoryTreeObj = {};//市场板块树形数据
var indexCategoryTreeObj = {};//指标树形对象
var marketCategoryTreeSettings = {};//市场分类设置参数
var indexCategoryTreeSettings = {};//指标树参数
var boardTreeObj = {};//板块树对象
var boardTreeSetting = {};//板块树参数
var pageRightHtml = "";//右边部分html内容
var _indexCount = 0;//设置指标序号
var specialValObj = {};//自定义指标值设置参数对象
var indexNo_map_indexSerialNo = {};//序号和指标id对应对象
var indexParamObj = {};//指标参数对象
var planId = "";//策略ID
var hasSavedPlanId = "";//保存的策略ID
var initIndustryDegreeZtreeObjs = {};//初始化行业弹出树图
var executeAjax_1 = null;//比较选股的ajax返回对象
var executeAjax_2 = null;//排序选股的ajax返回对象
var strategyNameArr = [];//策略名称数组
var selectedStrategyModelId = "";//选择的选股模块的ID
var strategyModelStatusArr = {};//模块状态数组
var save_model_flag = 0;//标志位,标记点击的按钮是排序选股还是指标参数选股
var grid = new Datatable();//策略模板下拉table对象
var markGrid=new Datatable();//策略行业设置table对象
var index_weight = false;//指标排序中的 权重  等权重是否勾选标识
var index_hidden_nodes = [];//记录被隐藏指标树图中的指标节点
var strategyUpdateId = "";//策略刷新ID
var stamp=true;//标记
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (prefix) {
    return this.slice(0, prefix.length) === prefix;
  };
}
if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}
(function (window, $) {
  $.fn.serializeJson = function () {
    var serializeObj = {};
    var array = this.serializeArray();
    $(array).each(
      function () {
        if (serializeObj[this.name]) {
          if ($.isArray(serializeObj[this.name])) {
            serializeObj[this.name].push(this.value);
          } else {
            serializeObj[this.name] = [
              serializeObj[this.name], this.value];
          }
        } else {
          serializeObj[this.name] = this.value;
        }
      });
    return serializeObj;
  };
})(window, jQuery);

/*		function getForecastYear(baseyear,calcYearOption){
			 baseyear=parseInt(baseyear);
			var forecastYear="";
				if(calcYearOption=="future_one_year"){
					forecastYear=""+baseyear;
				}else if(calcYearOption=="future_two_years"){
					forecastYear=""+(baseyear+1);
				}else if(calcYearOption=="future_three_years"){
					forecastYear=""+(baseyear+2);
				}else if(calcYearOption=="past_two_years"){
					forecastYear="过去"+(baseyear-3)+"-"+(baseyear-1)
				}else if(calcYearOption=="past_three_years"){
					forecastYear="过去"+(baseyear-4)+"-"+(baseyear-1)
				}else if(calcYearOption=="future_two_years_middle"){
					forecastYear="未来"+(baseyear-1)+"-"+(baseyear+1)+"中值";
				}else if(calcYearOption=="future_two_years_avg"){
					forecastYear="未来"+(baseyear-1)+"-"+(baseyear+1)+"均值";
				}else if(calcYearOption=="future_three_years_middle"){
					forecastYear="未来"+(baseyear-1)+"-"+(baseyear+2)+"中值";
				}else if(calcYearOption=="future_three_years_avg"){
					forecastYear="未来"+(baseyear-1)+"-"+(baseyear+2)+"均值";
				}
			return forecastYear;
		}*/

//清除历史（参数...）对象
function clearTmpObj() {
  indexParamObj = {};
  specialValObj = {};
  indexNo_map_indexSerialNo = {};
  _indexCount = 0;
}

//每年5月1日之前上年度报表未出
/*		function getForecastYearNumber(baseyear,calcYearOption){
			 baseyear=parseInt(baseyear);
			var forecastYear="";
				if(calcYearOption=="future_one_year"){
					forecastYear=""+baseyear;
				}else if(calcYearOption=="future_two_years"){
					forecastYear=""+(baseyear+1);
				}else if(calcYearOption=="future_three_years"){
					forecastYear=""+(baseyear+2);
				}else if(calcYearOption=="past_two_years"){
					forecastYear=(baseyear-3)+"-"+(baseyear-1)
				}else if(calcYearOption=="past_three_years"){
					forecastYear=(baseyear-4)+"-"+(baseyear-1)
				}else if(calcYearOption=="future_two_years_middle"){
					forecastYear=(baseyear-1)+"-"+(baseyear+1);
				}else if(calcYearOption=="future_two_years_avg"){
					forecastYear=(baseyear-1)+"-"+(baseyear+1);
				}else if(calcYearOption=="future_three_years_middle"){
					forecastYear=(baseyear-1)+"-"+(baseyear+2);
				}else if(calcYearOption=="future_three_years_avg"){
					forecastYear=(baseyear-1)+"-"+(baseyear+2);
				}
			return forecastYear;
		}*/

//1.初始化开始
$(function () {
  setDateInput();
  var currentDate = new Date();
  //设置指标设置参数保存方法
  $("button[id$='saveparambtn']").on("click", function () {
    var formId = $(this).parents(".modal").attr("id");
    /*指标切换数据存在差异问题*/
    if (!KyFromUtil.validateForm(formId + "_form")) {//校验指标参数设置form
      return;
    }
    var obj = $("#" + formId).find("form").serializeJson();
    var indexNo = $("#" + formId).data("indexNo");
    indexParamObj[formId + "_" + indexNo] = obj;

    var querydate = "";
    if (formId == "IC1000100010") {
      var deadlineoptionValue = $("input[name='tbaa_deadlineoptionsRadios']:checked").val();
      var calcYear = $("#tbaa_calc_year").val();
      var calcUnit = $("#tbaa_calc_unit").find("option:selected").text();
      if (deadlineoptionValue == "newest_closeday_radio") {
        querydate = GetDateStr(-1);
      } else if (deadlineoptionValue == "custom_day_radio") {
        querydate = $("#tbaa_custom_day_input").val();
      }
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(calcYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + calcYear + "年" + calcUnit + ")" + querydate);
      $("#" + formId).find(".modal-title").html("预测净利润(" + calcYear + "年)" + querydate);
    } else if (formId == "IC1000100020") {
      var deadlineoptionValue = $("input[name='tbab_deadlineoptionsRadios']:checked").val();
      var calcYear = $("#tbab_calc_year").val();
      if (deadlineoptionValue == "newest_closeday_radio") {
        querydate = GetDateStr(-1);
      } else if (deadlineoptionValue == "custom_day_radio") {
        querydate = $("#tbab_custom_day_input").val();
      }
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(calcYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + calcYear + "年)" + querydate);
      $("#" + formId).find(".modal-title").html("预测市盈率(" + calcYear + "年)" + querydate);
    } else if (formId == "IC1000100030") {
      var calcYear = $("#tbac_calc_year").find("option:selected").val();
      var calcUnit = $("#tbac_calc_unit").find("option:selected").text();
      var deadlineoptionsRadios = $("input[name='tbac_deadlineoptionsRadios']:checked").val();
      if (deadlineoptionsRadios == "newest_closeday_radio") {
        querydate = GetDateStr(-1);
      } else if (deadlineoptionsRadios == "custom_day_radio_val") {
        querydate = $("#tbac_custom_day").val();
      }
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(calcYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + calcYear + "年" + calcUnit + ")" + querydate);
      $("#" + formId).find(".modal-title").html("预测净利润同比增长率(" + calcYear + "年)" + querydate);
    } else if (formId == "IC1000100040") {//该指标暂时废弃
      var forecastTime = $("input[name='tbad_historic_range']:checked").val();
      var endDay = "";
      var startDay = "";
      if (forecastTime == "recent_one_month_val") {
        //最近1个月
        endDay = getLatestClosingDay(calcDate(getCurrentDay(), -1));
        startDay = calcDate(endDay, -30);
      } else if (forecastTime == "recent_three_months_val") {
        endDay = getLatestClosingDay(calcDate(getCurrentDay(), -1));
        startDay = calcDate(endDay, -90);
      } else if (forecastTime == "recent_six_months_val") {
        endDay = getLatestClosingDay(calcDate(getCurrentDay(), -1));
        startDay = calcDate(endDay, -180);
      } else if (forecastTime == "recent_one_year_val") {
        endDay = getLatestClosingDay(calcDate(getCurrentDay(), -1));
        startDay = calcDate(endDay, -365);
      }
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(startDay + "@" + endDay);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val(startDay + "至" + endDay);
      $("#" + formId).find(".modal-title").html("盈利预测调高次数" + "(" + startDay + "至" + endDay + ")");
    } else if (formId == "IC10002000100010") {
      var reportYear = $("#tbba_report_year").val();
      var reportUnit = $("#tbba_report_unit").find("option:selected").text();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
      $("#" + formId).find(".modal-title").html("资产负债率(" + reportYear + reportUnit + ")");
    } else if (formId == "IC10002000100020") {
      var reportYear = $("#tbbb_report_year").val();
      var reportUnit = $("#tbbb_report_unit").find("option:selected").text();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
      $("#" + formId).find(".modal-title").html("速动比率(" + reportYear + reportUnit + ")");
    } else if (formId == "IC10002000100030") {
      var reportYear = $("#tbbc_report_year").val();
      var reportUnit = $("#tbbc_report_unit").find("option:selected").text();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
      $("#" + formId).find(".modal-title").html("流动比率(" + reportYear + reportUnit + ")");
    } else if (formId == "IC10002000200010") {
      var reportRangeChecked = $("input[name='tbca_report_range']:checked").val();
      if (reportRangeChecked == "reportPeriod") {
        var reportYear = $("#tbca_report_year").val();
        var reportUnit = $("#tbca_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("净资产收益率ROE(" + reportYear + reportUnit + ")");
      } else if (reportRangeChecked == "singleQuarter") {
        var reportQuarter = $("#tbca_report_quarter").val();
        var reportQuarterUnit = $("#tbca_report_quarter_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportQuarter);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportQuarter + reportQuarterUnit + ")");
        $("#" + formId).find(".modal-title").html("净资产收益率ROE(" + reportQuarter + reportQuarterUnit + ")");
      } else if (reportRangeChecked == "ttm") {
        var reportYear = $("#tbca_ttm_report_year").val();
        var reportUnit = $("#tbca_ttm_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(TTM)(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("净资产收益率ROE(" + reportYear + reportUnit + ")");

        // var reportDate=$("input[name='tbca_report_date']").val();
        // $("#setParamInputHidden_"+$("#"+formId).data("indexNo")).val(reportDate);
        // $("#setParamInput_"+$("#"+formId).data("indexNo")).val("((ttm)"+reportDate+")");
        // $("#"+formId).find(".modal-title").html("净资产收益率ROE("+reportDate+")");
      }
    } else if (formId == "IC10002000200030") {
      var reportRangeChecked = $("input[name='tbcb_report_range']:checked").val();
      if (reportRangeChecked == "reportPeriod") {
        var reportYear = $("#tbcb_report_year").val();
        var reportUnit = $("#tbcb_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("总资产净利率ROA(" + reportYear + reportUnit + ")");
      } else if (reportRangeChecked == "singleQuarter") {
        var reportQuarter = $("#tbcb_report_quarter").val();
        var reportQuarterUnit = $("#tbcb_report_quarter_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportQuarter);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportQuarter + reportQuarterUnit + ")");
        $("#" + formId).find(".modal-title").html("总资产净利率ROA(" + reportQuarter + reportQuarterUnit + ")");
      } else if (reportRangeChecked == "ttm") {
        var reportYear = $("#tbcb_ttm_report_year").val();
        var reportUnit = $("#tbcb_ttm_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(TTM)(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("总资产净利率ROA(" + reportYear + reportUnit + ")");
      }
    } else if (formId == "IC10002000200040") {
      var reportRangeChecked = $("input[name='tbcc_report_range']:checked").val();
      if (reportRangeChecked == "reportPeriod") {
        var reportYear = $("#tbcc_report_year").val();
        var reportUnit = $("#tbcc_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("投入资本回报率ROIC(" + reportYear + reportUnit + ")");
      } else if (reportRangeChecked == "singleQuarter") {
        var reportQuarter = $("#tbcc_report_quarter").val();
        var reportQuarterUnit = $("#tbcc_report_quarter_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportQuarter);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportQuarter + reportQuarterUnit + ")");
        $("#" + formId).find(".modal-title").html("投入资本回报率ROIC(" + reportQuarter + reportQuarterUnit + ")");
      } else if (reportRangeChecked == "ttm") {
        var reportYear = $("#tbcc_ttm_report_year").val();
        var reportUnit = $("#tbcc_ttm_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(TTM)(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("投入资本回报率ROIC(" + reportYear + reportUnit + ")");
      }
    } else if (formId == "IC10002000200050") {
      var reportRangeChecked = $("input[name='tbcd_report_range']:checked").val();
      if (reportRangeChecked == "reportPeriod") {
        var reportYear = $("#tbcd_report_year").val();
        var reportUnit = $("#tbcd_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("销售毛利率(" + reportYear + reportUnit + ")");
      } else if (reportRangeChecked == "singleQuarter") {
        var reportQuarter = $("#tbcd_report_quarter").val();
        var reportQuarterUnit = $("#tbcd_report_quarter_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportQuarter);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportQuarter + reportQuarterUnit + ")");
        $("#" + formId).find(".modal-title").html("销售毛利率(" + reportQuarter + reportQuarterUnit + ")");
      } else if (reportRangeChecked == "ttm") {
        var reportYear = $("#tbcd_ttm_report_year").val();
        var reportUnit = $("#tbcd_ttm_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(TTM)(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("销售毛利率(" + reportYear + reportUnit + ")");
      }
    } else if (formId == "IC10002000200060") {
      var reportRangeChecked = $("input[name='tbce_report_range']:checked").val();
      if (reportRangeChecked == "reportPeriod") {
        var reportYear = $("#tbce_report_year").val();
        var reportUnit = $("#tbce_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("销售净利率(" + reportYear + reportUnit + ")");
      } else if (reportRangeChecked == "singleQuarter") {
        var reportQuarter = $("#tbce_report_quarter").val();
        var reportQuarterUnit = $("#tbce_report_quarter_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportQuarter);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportQuarter + reportQuarterUnit + ")");
        $("#" + formId).find(".modal-title").html("销售净利率(" + reportQuarter + reportQuarterUnit + ")");
      } else if (reportRangeChecked == "ttm") {
        var reportYear = $("#tbce_ttm_report_year").val();
        var reportUnit = $("#tbce_ttm_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(TTM)(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("销售净利率(" + reportYear + reportUnit + ")");
      }
    } else if (formId == "IC10002000200020") {
      var calcCaliber = $("#tbcf_calc_caliber").find("option:selected").text();
      var reportUnit = $("#tbcf_report_unit").find("option:selected").text();
      var reportYear = $("#tbcf_report_year").val();
      var reportRangeChecked = $("input[name='tbcf_report_range']:checked").val();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + calcCaliber + ")");
      $("#" + formId).find(".modal-title").html("净资产收益率ROE差值(" + reportYear + reportUnit + calcCaliber + ")");
    } else if (formId == "IC10002000200025") {
      //十年年度ROE均值
      var reportYear = $("#tbroe_report_year").val();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);

      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + (reportYear - 9) + "-" + reportYear + ")年度");
      $("#" + formId).find(".modal-title").html("十年年度ROE均值(" + (reportYear - 9) + ")");
    } else if (formId == "IC1200100040") {
      //十年年度ROE均值标准差率
      var reportYear = $("#tbtyroed_report_year").val();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);

      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + (reportYear - 9) + "-" + reportYear + ")年度");
      $("#" + formId).find(".modal-title").html("十年年度ROE均值标准差率(" + (reportYear - 9) + ")");
    } else if (formId == "IC10002000200026") {
      //十年年度ROIC均值
      var reportYear = $("#tbroic_report_year").val();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);

      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + (reportYear - 9) + "-" + reportYear + ")年度");
      $("#" + formId).find(".modal-title").html("十年年度ROIC均值(" + (reportYear - 9) + ")");
    } else if (formId == "IC1200100030") {
      //十年年度ROIC均值标准差率
      var reportYear = $("#tbtyroicd_report_year").val();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);

      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + (reportYear - 9) + "-" + reportYear + ")年度");
      $("#" + formId).find(".modal-title").html("十年年度ROIC均值标准差率(" + (reportYear - 9) + ")");
    } else if (formId == "IC10002000200027") {
      //十年净利润复合增长率
      var reportYear = $("#tbtycagr_report_year").val();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + (reportYear - 10) + "-" + reportYear + ")年度");
      $("#" + formId).find(".modal-title").html("十年净利润复合增长率(" + (reportYear - 10) + ")");
    } else if (formId == "IC1200100050") {
      //十年净利润复合增长率标准差率
      var reportYear = $("#tbtycagrd_report_year").val();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + (reportYear - 10) + "-" + reportYear + ")年度");
      $("#" + formId).find(".modal-title").html("十年净利润复合增长率标准差率(" + (reportYear - 10) + ")");
    }  else if (formId == "IC1200100010") {
      //管理层评分
      var reportDate = $("#tbtymv_report_date").val();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportDate);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportDate + ")");
      $("#" + formId).find(".modal-title").html("管理层评分(" + reportDate + ")");
    }  else if (formId == "IC10002000300061") {
      //经营活动产生的现金流量净额/营业收入 （十年年度均值）
      var reportYear = $("#tbtycfdc_report_year").val();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + (reportYear - 9) + "-" + reportYear + ")年度");
      $("#" + formId).find(".modal-title").html("经营活动产生的现金流量净额/营业收入 （十年年度均值）(" + (reportYear - 9) + ")");
    }  else if (formId == "IC1200100020") {
      //经营活动产生的现金流量净额/营业收入 （十年年度均值）标准差率
      var reportYear = $("#tbtycd_report_year").val();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + (reportYear - 9) + "-" + reportYear + ")年度");
      $("#" + formId).find(".modal-title").html("经营活动产生的现金流量净额/营业收入 （十年年度均值）标准差率(" + (reportYear - 9) + ")");
    } else if (formId == "IC10002000200080") {
      var reportUnit = $("#tbcg_report_unit").find("option:selected").text();
      var reportYear = $("#tbcg_report_year").val();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
      $("#" + formId).find(".modal-title").html("销售毛利率环比增速(" + reportYear + reportUnit + ")");
    } else if (formId == "IC10002000200070") {
      var reportUnit = $("#tbch_report_unit").find("option:selected").text();
      var reportYear = $("#tbch_report_year").val();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
      $("#" + formId).find(".modal-title").html("净资产收益率ROE环比增加值(" + reportYear + reportUnit + ")");
    } else if (formId == "IC10002000200090") {
      var reportYear = $("#tbck_report_year").val();
      var reportUnit = $("#tbck_report_unit").find("option:selected").text();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
      $("#" + formId).find(".modal-title").html("净资产收益率ROE同比增加率(" + reportYear + reportUnit + ")");
    } else if (formId == "IC10002000300010") {

      var reportYear = $("#tbda_report_year").val();

      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + "年报)");
      $("#" + formId).find(".modal-title").html("企业自由现金流量FCFF(" + reportYear + "年报)");
    } else if (formId == "IC10002000300020") {
      var reportRangeChecked = $("input[name='tbdb_report_range']:checked").val();
      if (reportRangeChecked == "reportPeriod") {
        var reportYear = $("#tbdb_report_year").val();
        var reportUnit = $("#tbdb_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("经营活动产生的现金流量净额(" + reportYear + reportUnit + ")");
      } else if (reportRangeChecked == "singleQuarter") {
        var reportQuarter = $("#tbdb_report_quarter").val();
        var reportQuarterUnit = $("#tbdb_report_quarter_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportQuarter);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportQuarter + reportQuarterUnit + ")");
        $("#" + formId).find(".modal-title").html("经营活动产生的现金流量净额(" + reportQuarter + reportQuarterUnit + ")");
      } else if (reportRangeChecked == "ttm") {
        var reportYear = $("#tbdb_ttm_report_year").val();
        var reportUnit = $("#tbdb_ttm_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("((TTM)" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("经营活动产生的现金流量净额(TTM)" + reportYear + reportUnit + "");
      }
    } else if (formId == "IC10002000300030") {
      var reportRangeChecked = $("input[name='tbde_report_range']:checked").val();
      if (reportRangeChecked == "reportPeriod") {
        var reportYear = $("#tbde_report_year").val();
        var reportUnit = $("#tbde_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("经营活动产生的现金流量净额/营业收入(" + reportYear + reportUnit + ")");
      } else if (reportRangeChecked == "singleQuarter") {
        var reportQuarter = $("#tbde_report_quarter").val();
        var reportQuarterUnit = $("#tbde_report_quarter_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportQuarter);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportQuarter + reportQuarterUnit + ")");
        $("#" + formId).find(".modal-title").html("经营活动产生的现金流量净额/营业收入(" + reportQuarter + reportQuarterUnit + ")");
      } else if (reportRangeChecked == "ttm") {
        var reportYear = $("#tbde_ttm_report_year").val();
        var reportUnit = $("#tbde_ttm_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("((TTM)" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("经营活动产生的现金流量净额/营业收入(TTM)" + reportYear + reportUnit + "");
      }
    } else if (formId == "IC10002000300040") {
      var reportRangeChecked = $("input[name='tbdf_report_range']:checked").val();
      if (reportRangeChecked == "reportPeriod") {
        var reportYear = $("#tbdf_report_year").val();
        var reportUnit = $("#tbdf_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("经营活动产生的现金流量净额／归母净利润(" + reportYear + reportUnit + ")");
      } else if (reportRangeChecked == "singleQuarter") {
        var reportQuarter = $("#tbdf_report_quarter").val();
        var reportQuarterUnit = $("#tbdf_report_quarter_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportQuarter);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportQuarter + reportQuarterUnit + ")");
        $("#" + formId).find(".modal-title").html("经营活动产生的现金流量净额／归母净利润(" + reportQuarter + reportQuarterUnit + ")");
      } else if (reportRangeChecked == "ttm") {
        var reportYear = $("#tbdf_ttm_report_year").val();
        var reportUnit = $("#tbdf_ttm_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("((TTM)" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("经营活动产生的现金流量净额／归母净利润(TTM)" + reportYear + reportUnit + "");
      }
    } else if (formId == "IC10002000300060") {
      var reportQuarter = $("#tbdg_report_quarter").val();
      var reportQuarterUnit = $("#tbdg_report_quarter_unit").find("option:selected").text();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportQuarter);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportQuarter + reportQuarterUnit + ")");
      $("#" + formId).find(".modal-title").html("研发费用占收入比例(" + reportQuarter + reportQuarterUnit + ")");
    } else if (formId == "IC10002000300050") {
      var v1, v2;
      var raido_val = $("input[name='tbdh_report_range']:checked").val();
      if (raido_val == 'reportPeriod') {
        //报告期
        v1 = $("#tbdh_report_year").val();
        v2 = $("#tbdh_report_unit").find("option:selected").text();
      } else if (raido_val == 'singleQuarter') {
        //单季度
        v1 = $("#tbdh_single_quarter_report_year").val();
        v2 = $("#tbdh_single_quarter_unit").find("option:selected").text();
      }
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(v1);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + v1 + v2 + ")");
      $("#" + formId).find(".modal-title").html("资本开支同比增长率(" + v1 + v2 + ")");
    } else if (formId == "IC10002000400010") {
      var forecastYear = "";
      var deadlineoptionValue = $("input[name='tbea_deadlineoptionsRadios']:checked").val();
      var calcCaliber = $("#tbea_calc_caliber").val();
      if (deadlineoptionValue == "newest_closeday_radio") {
        querydate = GetDateStr(-1);
        forecastDesc = getCagrNumberOrDesc(querydate, calcCaliber);
        forecastYear = getCagrNumberOrDesc(querydate, calcCaliber, '0');

      } else if (deadlineoptionValue == "custom_day_radio") {
        querydate = $("#tbea_custom_day_input").val();
        forecastDesc = getCagrNumberOrDesc(querydate, calcCaliber);
        forecastYear = getCagrNumberOrDesc(querydate, calcCaliber, '0');
      }
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(forecastYear);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + forecastDesc + ")" + querydate);
      $("#" + formId).find(".modal-title").html("复合增长率CAGR(" + forecastDesc + ")" + querydate);
    } else if (formId == "IC10002000400030") {
      var reportRangeChecked = $("input[name='tbeb_report_range']:checked").val();
      if (reportRangeChecked == "reportPeriod") {
        var reportYear = $("#tbeb_report_year").val();
        var reportUnit = $("#tbeb_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("净利润同比增长率(" + reportYear + reportUnit + ")");
      } else if (reportRangeChecked == "singleQuarter") {
        var reportQuarter = $("#tbeb_report_quarter").val();
        var reportQuarterUnit = $("#tbeb_report_quarter_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportQuarter);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportQuarter + reportQuarterUnit + ")");
        $("#" + formId).find(".modal-title").html("净利润同比增长率(" + reportQuarter + reportQuarterUnit + ")");
      } else if (reportRangeChecked == "ttm") {
        var reportYear = $("#tbeb_ttm_report_year").val();
        var reportUnit = $("#tbeb_ttm_report_unit").find("option:selected").text();
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYear);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("((TTM)" + reportYear + reportUnit + ")");
        $("#" + formId).find(".modal-title").html("净利润同比增长率(TTM)" + reportYear + reportUnit + "");
      }
    }

    if (formId == "IC1000500020" || formId == "IC1000500010") {
      var name = "tbhb_transaction_date";
      var title = "换手率";
      if (formId == "IC1000500010") {
        title = "涨跌幅";
        name = "tbha_transaction_date";
      }
      //换手率
      var transactionValue = $('input[name=' + name + ']:checked').val();
      var now_date = GetDateStr(-1);//当前日期
      var range_month_num = 0;//区间
      var result = "";//计算结果日期
      if (transactionValue == "recent_one_month") {
        //近一个月
        range_month_num = -1 * 30;
        result = GetDateStr(range_month_num);
      } else if (transactionValue == "recent_three_months") {
        //近三个月
        range_month_num = -3 * 30;
        result = GetDateStr(range_month_num);
      } else if (transactionValue == "recent_six_months") {
        //近六个月
        range_month_num = -6 * 30;
        result = GetDateStr(range_month_num);
      } else if (transactionValue == "recent_twelve_months") {
        //近六个月
        range_month_num = -12 * 30;
        result = GetDateStr(range_month_num);
      } else if (transactionValue == "recent_start_end") {
        range_month_num = -1;
        //时间区间
        if (formId == "IC1000500010") {
          result = $("#tbha_recent_start").val();
          now_date = $("#tbha_recent_end").val();
        } else {
          result = $("#tbhb_recent_start").val();
          now_date = $("#tbhb_recent_end").val();
        }
        if (!result || !now_date) {
          $("#" + formId + "_CUSTOMIZE_error").show();
          $("#" + formId + "_CUSTOMIZE_FORM_error_text").text("请输入参数.");
          return;
        } else if (result > now_date) {
          $("#" + formId + "_CUSTOMIZE_error").show();
          $("#" + formId + "_CUSTOMIZE_FORM_error_text").text("开始日不能大于结束日.");
          return;
        } else {
          $("#" + formId + "_CUSTOMIZE_error").hide();
          $("#" + formId + "_CUSTOMIZE_FORM_error_text").text("");
        }
      }
      if (range_month_num != 0) {
        var params = result + " 至 " + now_date;
        //回填
        $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(result + "@" + now_date);
        $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + params + ")");
        $("#" + formId).find(".modal-title").html(title + "(" + params + ")");
      }
    } else if (formId == "IC1000400040") {
      //分红收益率
      //换手率
      var _radio = $("input:radio[name='tbgd_report_year_radio']:checked").val();//单选按钮
      var val = "";
      var params = "";
      if (_radio == "0") {
        val = $('#tbgd_report_year').val();
        params = "(" + val + "年度)";
        val = _radio + "@" + val;
      } else if (_radio == "1") {
        var start = $('#tbgd_report_date_start').val();
        var end = $('#tbgd_report_date_end').val();
        params = "(" + start + "至" + end + ")";
        val = _radio + "@" + start + "|" + end;
      }

      var reportdateValue = $('#tbgd_report_date').val();
      params += reportdateValue + "查询日";
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(val + "@" + reportdateValue);
      //回填
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val(params);
      $("#" + formId).find(".modal-title").html("分红收益率" + params);
    } else if (formId == "IC1000400030") {
      //股价/每股经营性现金流净额
      //单选按钮
      var selectValue = "";
      var reportValue = $('input[name=tbgc_report_radio]:checked').val();
      if (reportValue == "tbgc_report_latest") {
        //前一交易日
        selectValue = GetDateStr(-1);
      } else if (reportValue == "tbgc_report_date") {
        //自定义日期
        selectValue = $("#tbgc_report_date_text").val();
      }
      //回填
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(selectValue);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + selectValue + ")");
      $("#" + formId).find(".modal-title").html("股价/每股经营性现金流净额" + "(" + selectValue + ")");
    } else if (formId == "IC1000400020" || formId == "IC1000400010") {
      //中证500成分权重|沪深300成分权重
      var title = "中证500成分权重";
      var radio = "tbgb_transaction_radio";
      var latest = "tbgb_transaction_latest";
      var transactionValue_str = "tbgb_transaction_date";
      var select = "#tbgb_transaction_date_text";
      if (formId == "IC1000400010") {
        radio = "tbga_transaction_radio";
        latest = "tbga_transaction_latest";
        transactionValue_str = "tbga_transaction_date";
        select = "#tbga_transaction_date_text";
        title = "沪深300成分权重";
      }
      //单选按钮
      var selectValue;
      var transactionValue = $('input[name=' + radio + ']:checked').val();
      if (transactionValue == latest) {
        //前一交易日
        selectValue = GetDateStr(-1);
      } else if (transactionValue == transactionValue_str) {
        //自定义日期
        selectValue = $(select).val();
      }
      //回填
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(selectValue);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + selectValue + ")");
      $("#" + formId).find(".modal-title").html(title + "(" + selectValue + ")");
    } else if (formId == "IC1000300040" || formId == "IC1000300030") {
      //预测市盈率相对利润增长比率PEG,市盈率相对利润增长比率PEG
      var title = "预测";
      var denominator_vagr_value_id = "#tbfd_denominator_vagr_value";
      var transaction_date = "tbfd_transaction_date";
      var custom_day = "#tbfd_custom_day";
      if (formId == "IC1000300030") {
        denominator_vagr_value_id = "#tbfc_denominator_vagr_value";
        transaction_date = "tbfc_transaction_date";
        custom_day = "#tbfc_custom_day";
        title = "";
      }
      var tbfd_denominator_vagr_value = $(denominator_vagr_value_id).val();//计算口径
      var radio = $('input[name=' + transaction_date + ']:checked').val();//单选按钮
      var date;
      var start_date;//起始
      var end_date;//结束
      if (radio == "latest_closing_date") {
        //前一交易日
        date = GetDateStr(-1);
      } else if (radio == "custom_day_radio_val") {
        //自定义日期
        date = $(custom_day).val();
      }
      var forecastDesc = getCagrNumberOrDesc(date, tbfd_denominator_vagr_value);
      var forecastYear = getCagrNumberOrDesc(date, tbfd_denominator_vagr_value, '0');
      start_date = forecastYear.split("-")[0];
      end_date = forecastYear.split("-")[1];
      //回填
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val
      (start_date + "@" + end_date + "@" + tbfd_denominator_vagr_value + "@" + date);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + forecastDesc + ")" + date);
      $("#" + formId).find(".modal-title").html(title + "市盈率相对利润增长比率PEG" + "(" + forecastDesc + ")" + date);
    } else if (formId == "IC1000300020" || formId == "IC1000300010") {
      //市净率PB、市盈率PE（TTM）
      var title = '市净率PB';
      var raido_id = "tbfb_transaction_date";
      var custom_day = "#tbfb_custom_day";
      if (formId == "IC1000300010") {
        raido_id = "tbfa_transaction_date";
        title = '市盈率PE（TTM）';
        custom_day = "#tbfa_custom_day";
      }
      var radio = $('input[name=' + raido_id + ']:checked').val();//单选按钮
      var date;
      if (radio == "latest_closing_date") {
        //前一交易日
        date = GetDateStr(-1);
      } else if (radio == "one_week_before_val") {
        //一周前
        date = GetDateStr(-7);
      } else if (radio == "one_month_before_val") {
        //一月前
        date = GetDateStr(-30);
      } else if (radio == "three_month_before_val") {
        //三月前
        date = GetDateStr(-30 * 3);
      } else if (radio == "six_months_before_val") {
        //六个月前
        date = GetDateStr(-(30 * 6));
      } else if (radio == "one_year_before_val") {
        //一年前
        date = GetDateStr(-365);
      } else if (radio == "custom_day_radio_val") {
        //自定义
        date = $(custom_day).val();
      }
      //回填
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(date);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + date + ")");
      $("#" + formId).find(".modal-title").html(title + "(" + date + ")");
    } else if (formId == "IC1000600050") {
      //总市值/经营性现金流净额
      var date;
      var radio = $('input[name=tbma_report_radio]:checked').val();//单选按钮
      if (radio == "tbma_report_latest") {
        date = GetDateStr(-1);
      } else if (radio == "tbma_report_date") {
        date = $("#tbma_report_date_text").val();
      }
      //回填
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(date);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + date + ")");
      $("#" + formId).find(".modal-title").html("总市值/经营性现金流净额（TTM）" + "(" + date + ")");
    } else if (formId == "IC1000600030") {
      //总资产报酬率ROA（TTM）
      var val = $("#tbka_report_date").val();
      if (isNull(val)) {
        $('#error_message_IC1000600030_form').text("查询日期必须填写!");
        return;
      }
      //回填
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(val);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + val + ")");
      $("#" + formId).find(".modal-title").html("总资产报酬率ROA（TTM）" + "(" + val + ")");
    } else if (formId == "IC1000500040") {
      //行业沪深300权重
      var date;
      var option_val = $("#tboa_industry_select").find("option:selected").val();
      var radio_val = $("input[name=tboa_transaction_radio]:checked").val();//单选按钮
      if (radio_val == "tboa_transaction_latest") {
        date = GetDateStr(-1);
      } else if (radio_val == "tboa_transaction_date") {
        date = $("#tboa_transaction_date_text").val();
      }
      //回填
      var option_str = $("#tboa_industry_select").find("option:selected").text();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(option_val + "@" + date);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + option_str + " " + date + ")");
      $("#" + formId).find(".modal-title").html("行业沪深300权重" + "(" + option_str + " " + date + ")");
      $("#cs").val(option_str);
    } else if (formId == "IC1000500030") {
      //行业净利润同比增长率
      var return_val;
      var option_val = $("#tbna_industry_select").find("option:selected").val();//行业
      var radio_val = $("input[name=tbna_report_range]:checked").val();//单选按钮
      var v1_str;
      var v2_str;
      if (radio_val == "reportPeriod") {
        //报告期
        var v1 = $("#tbna_report_year").find("option:selected").val();
        var v2 = $("#tbna_report_unit").find("option:selected").val();
        v1_str = $("#tbna_report_year").find("option:selected").text();
        v2_str = $("#tbna_report_unit").find("option:selected").text();
        return_val = option_val + "@" + radio_val + "@" + v1 + "@" + v2;
      } else if (radio_val == "singleQuarter") {
        //单季度
        var v1 = $("#tbna_report_quarter").find("option:selected").val();
        var v2 = $("#tbna_report_quarter_unit").find("option:selected").val();
        v1_str = $("#tbna_report_quarter").find("option:selected").text();
        v2_str = $("#tbna_report_quarter_unit").find("option:selected").text();
        return_val = option_val + "@" + radio_val + "@" + v1 + "@" + v2;
      } else if (radio_val == "ttm") {
        //TTM 行业@radiovalue@key1[@key2]
        var v1 = $("#tbna_report_date").find("option:selected").val();
        var v2 = $("#tbna_report_ttm").find("option:selected").val();
        return_val = option_val + "@" + radio_val + "@" + v1 + "@" + v2;
        v1_str = $("#tbna_report_date").find("option:selected").text();
        v2_str = $("#tbna_report_ttm").find("option:selected").text();
      }
      //回填
      var option_text = $("#tbna_industry_select").find("option:selected").text();
      var radio_text = $("input[name=tbna_report_range]:checked").text();
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(return_val);
      if (!v2_str) v2_str = "";
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val
      ("(" + option_text + " " + radio_text + " " + v1_str + " " + v2_str + ")");
      $("#" + formId).find(".modal-title").html("行业净利润同比增长率" + "(" + option_text + " " + radio_text + " " + v1_str + " " + v2_str + ")");
    } else if (formId == "IC1000600020") {
      //市净率PB 港
      var date;
      var radio = $('input[name=tbja_custom_radio]:checked').val();//单选按钮
      if (radio == "tbja_custom_latest") {
        date = GetDateStr(-1);
      } else if (radio == "tbja_custom_day") {
        date = $("#tbja_custom_day").val();
      }
      //回填
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(date);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + date + ")");
      $("#" + formId).find(".modal-title").html("市净率PB" + "(" + date + ")");
    } else if (formId == "IC1000600010") {
      //市盈率PE（TTM） 港
      var val = $("#tbiacustom_day").val();
      if (isNull(val)) {
        $('#error_message_IC1000600010').text("查询日期必须填写!");
        return;
      }
      //回填
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(val);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + val + ")");
      $("#" + formId).find(".modal-title").html("市盈率PE（TTM）" + "(" + val + ")");
    } else if (formId == "IC1000600040") {
      //港股 分红收益率
      var reportYearValue = $('#date-picker-left').val();
      if(isNull(reportYearValue)){
        $('#error_message_IC1000600040_form').text("查询日期必须填写!");
        return;
      }
      //回填
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(reportYearValue);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + reportYearValue + ")");
      $("#" + formId).find(".modal-title").html("分红收益率（TTM）" + "(" + reportYearValue + ")");
    } else if (formId == "IC10002000300070") {
      //营业收入
      var result = "";
      var result_text = "";
      var radio = $("input[name=tbye_report_range]:checked").val();//单选按钮
      if (radio == "reportPeriod") {
        var year = $("#tbye_report_year").find("option:selected").val();
        var quarter = $("#tbye_report_unit").find("option:selected").val();
        result = year + "@" + quarter;
        result_text = $("#tbye_report_year").find("option:selected").val() + "" +
          $("#tbye_report_unit").find("option:selected").text();
      } else if (radio == "singleQuarter") {
        var year = $("#tbye_report_quarter").find("option:selected").val();
        var quarter = $("#tbye_report_quarter_unit").find("option:selected").val();
        result = year + "@" + quarter;
        result_text = $("#tbye_report_quarter").find("option:selected").val() + "" +
          $("#tbye_report_quarter_unit").find("option:selected").text();
      } else if (radio == "ttm") {
        var reportYear = $("#tbye_ttm_report_year").val();
        var reportUnit = $("#tbye_ttm_report_unit").find("option:selected").text();
        result = "(TTM)" + reportYear + reportUnit;
        result_text = "(TTM)" + reportYear + reportUnit;
      }
      //回填
      $("#setParamInputHidden_" + $("#" + formId).data("indexNo")).val(radio + "@" + result);
      $("#setParamInput_" + $("#" + formId).data("indexNo")).val("(" + result_text + ")");
      $("#" + formId).find(".modal-title").html("营业收入" + "(" + result_text + ")");
    }
    $("#" + formId).modal("hide");
  });
  var calc_caliber_options = "<option></option><option value='" + currentDate.getFullYear() + "'>预测" + currentDate.getFullYear() + "年</option><option value='" + (currentDate.getFullYear() + 1) + "'>预测" + (currentDate.getFullYear() + 1) + "年</option>";
  $("#tbac_calc_caliber").html(calc_caliber_options);
  var report_year_options = "<option></option>";
  for (var i = currentDate.getFullYear(); i >= 2005; i--) {
    report_year_options += "<option value='" + i + "'>" + i + "年</option>";
  }
  $("#tbaa_calc_year").html(getYearsOptinos('0'));
  $("#tbab_calc_year").html(getYearsOptinos('0'));
  $("#tbac_calc_year").html(getYearsOptinos('0'));
  $("select[id$='report_year'],select[id$='report_quarter']").each(function () {
    $(this).html(report_year_options);
    if ($(this).prop("id") == 'tbda_report_year') {
      $(this).find("option[value='" + currentDate.getFullYear() + "']").remove();
      var i = 1;
      $("#tbda_report_year option").each(function () {
        //遍历所有option
        if (i > 1) {
          var txt = $(this).text($(this).text() + "度");   //获取option的text值
        }
        i++;
      });
      i = 1;
    }
  });
  $("select[id$='report_year'],select[id$='report_quarter']").on('change', function () {
    if ($(this).val() == currentDate.getFullYear()) {
      var selectId = $(this).prop("id");
      var prefix = selectId.substring(0, selectId.indexOf("_"));
      if ($(this).parent().parent().find("select[id^='" + prefix + "'][id$='_unit']")[0]) {
        $(this).parent().parent().find("select[id^='" + prefix + "'][id$='_unit']").select2("val", " ");
        var firstQuarterDate = new Date().setFullYear(currentDate.getFullYear(), 3, 30);
        var twiceQuarterDate = new Date().setFullYear(currentDate.getFullYear(), 7, 31);
        var thirdQuarterDate = new Date().setFullYear(currentDate.getFullYear(), 9, 31);
        if (currentDate <= firstQuarterDate) {
          $(this).parent().parent().find("select[id^='" + prefix + "'][id$='_unit']").find("option").attr("disabled", "disabled");
        } else if (currentDate > firstQuarterDate && currentDate <= twiceQuarterDate) {
          $(this).parent().parent().find("select[id^='" + prefix + "'][id$='_unit']").find("option:eq(2),option:eq(3),option:eq(4)").attr("disabled", "disabled");
        } else if (currentDate > twiceQuarterDate && currentDate <= thirdQuarterDate) {
          $(this).parent().parent().find("select[id^='" + prefix + "'][id$='_unit']").find("option:eq(3),option:eq(4)").attr("disabled", "disabled");
        } else if (currentDate > thirdQuarterDate) {
          $(this).parent().parent().find("select[id^='" + prefix + "'][id$='_unit']").find("option:eq(4)").attr("disabled", "disabled");
        }

      }
    } else {
      var selectId = $(this).prop("id");
      var prefix = selectId.substring(0, selectId.indexOf("_"));
      var firstQuarterDate = new Date().setFullYear(currentDate.getFullYear(), 3, 30);
      $(this).parent().parent().find("select[id^='" + prefix + "'][id$='_unit']").select2("val", " ");
      if ($(this).parent().parent().find("select[id^='" + prefix + "'][id$='_unit']")[0]) {
        $(this).parent().parent().find("select[id^='" + prefix + "'][id$='_unit']").find("option").attr("disabled", false);
      }
      if ($(this).val() == currentDate.getFullYear() - 1) {
        if (currentDate <= firstQuarterDate) {
          $(this).parent().parent().find("select[id^='" + prefix + "'][id$='_unit']").find("option:eq(4)").attr("disabled", "disabled");
        }
      }
    }

  });
  $(".select2-saya").select2({
    allowClear: true
  });

  // SharePolicy.setSelect2GroupData("setProd_select", "/app/sharePolicy/strategyInvestor/selectProd", {}, true);
  SharePolicy.setSelect2DynamicData("setUser_select", "/app/sharePolicy/industryUser/selectUser", {}, false);


  // $("#id").attr("readOnly",false); 不可编辑，可以传值
  $("#mcolse").click(function () {


    if (executeAjax_1) {
      executeAjax_1.abort();
    }
    if (executeAjax_2) {
      executeAjax_2.abort();
    }
    $('#myModal1').modal('hide');
  });
  // $("#id").attr("readOnly",false); 不可编辑，可以传值
  $(".date-picker input").attr("readonly", "readonly");
  $(".date-picker input").css("background-color", "white");
  $(".date-picker-year input").attr("readonly", "readonly");
  $(".date-picker-year input").css("background-color", "white");
  $(".date-picker-year-Lastyear input").attr("readonly", "readonly");
  $(".date-picker-year-Lastyear input").css("background-color", "white");
  $('.date-picker-config').datepicker({
    orientation: "left",
    autoclose: true,
    format: 'yyyy-mm-dd',
    language : 'zh-CN',
  });
  //设置结束时间必须晚于开始时间
  $(".date-picker-start").datepicker().on('changeDate', function (e) {
    //获取选取的开始时间
    var endTimeStart = $("#tbgd_report_date_start").val();
    //设置开始时间
    $('.date-picker-end').datepicker('setStartDate', endTimeStart);
  });


  $("input[name$='transaction_date']").on('change', function () {
    $("label[id$='CUSTOMIZE_error']").hide();
    $("font[id$='CUSTOMIZE_FORM_error_text']").text("");
    var val = $(this).val();
    if (val == 'recent_start_end') {
      $("input[name$='recent_start']").attr("readonly", false).attr("disabled", false);
      $("input[name$='recent_end']").attr("readonly", false).attr("disabled", false);
    } else {
      $("input[name$='recent_start']").val("");
      $("input[name$='recent_end']").val("");
      $("input[name$='recent_start']").attr("readonly", true).attr("disabled", true);
      $("input[name$='recent_end']").attr("readonly", true).attr("disabled", true);
    }
  });

  $('.date-picker').datepicker({
    orientation: "left",
    autoclose: true,
    format: 'yyyy-mm-dd',
    language : 'zh-CN',
    endDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  });
  $(".date-picker-left").datepicker({
    orientation: "left",
    format: 'yyyy-mm-dd',
    autoclose: true,
    language : 'zh-CN',
    endDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  });
  //只选年度的
  $(".date-picker-year").datepicker({

    language: 'zh-CN',
    format: 'yyyy',
    autoclose: true,
    startView: 'year',
    minView: 'year',
    maxView: 'decade',
    maxViewMode: 2,
    minViewMode: 2,
    forceParse: false,
    todayHighlight: true,
    startDate: '2016',
    endDate: new Date()
  });

  //限制不能选择今年
  $(".date-picker-year-Lastyear").datepicker({
    language: 'zh-CN',
    format: 'yyyy',
    autoclose: true,
    startView: 'year',
    minView: 'year',
    maxView: 'decade',
    maxViewMode: 2,
    minViewMode: 2,
    forceParse: false,
    todayHighlight: true,
    endDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365)
  });


  //指标设置按钮触发事件
  $("button[id$='_savebtn']").on("click", function () {
    var modalDivId = $(this).prop("id").substring(0, $(this).prop("id").lastIndexOf("_"));
    var treeObj = initIndustryDegreeZtreeObjs[modalDivId + "_obj"];
    var checkedNodes = treeObj.getCheckedNodes(true);
    var checkedNodesName = "";
    var checkedNodesId = "";
    for (var i = 0, len = checkedNodes.length; i < len; i++) {
      checkedNodesName += checkedNodes[i].name + ",";
      checkedNodesId += checkedNodes[i].id + ",";
    }
    if (checkedNodes.length > 0) {
      if (treeObj.getNodes().length == checkedNodes.length) {
        checkedNodesName = $("#" + modalDivId).find(".modal-title").text();
      } else {
        checkedNodesName = "(" + $("#" + modalDivId).find(".modal-title").text() + ")" + checkedNodesName.substring(0, checkedNodesName.length - 1);
      }
      checkedNodesId = checkedNodesId.substring(0, checkedNodesId.length - 1);
    }
    $("#stock_range").val(modalDivId + "@" + checkedNodesId);
    $("#currentSelectRange").val(checkedNodesName);


    $("#" + modalDivId).modal("hide");
  });
  //行业保存按钮触发事件
  $("button[id='IC0000000000_CUSTOMIZE_savebtn_1']").on("click", function () {
    var form = "IC0000000000_CUSTOMIZE_FORM";
    var value = KyFromUtil.getItemValue(form, "CUSTOMIZE_RATIO_SELECT");//获取字段值
    var value_num = KyFromUtil.getItemValue(form, "SORT_VALUE_CUSTOMIZE");//获取字段值
    if (isNull(value) || isNull(value_num)) {
      $("#IC0000000000_CUSTOMIZE_error").show();
      $('#IC0000000000_CUSTOMIZE_FORM_error_text').text("请选择行业或输入正整数值!");
      return;
    } else {
      $("#IC0000000000_CUSTOMIZE_error").hide();
      $('#IC0000000000_CUSTOMIZE_FORM_error_text').text("");
    }
    if(!/^\+?[1-9][0-9]*$/.test(value_num)){
      $("#IC0000000000_CUSTOMIZE_error").show();
      $('#IC0000000000_CUSTOMIZE_FORM_error_text').text("请输入正整数!");
      return;
    }else{
      $("#IC0000000000_CUSTOMIZE_error").hide();
      $('#IC0000000000_CUSTOMIZE_FORM_error_text').text("");
    }
    //$("body").data("customize_val",value+"△"+value_num);
    var hisval = ($("#conditional-expression>option:last-child").val()).split("@")[0];
    var hy_name = $("#CUSTOMIZE_RATIO_SELECT").find("option:selected").text();
    $("#conditional-expression>option:last-child").val(hisval + "@" + value + "△" + value_num);

    $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(" + hy_name + "前" + value_num + "名)");
    $("#customize_ratio_select_hidden").val(value);
    $("#sort_value_customize_hidden").val(value_num);
    $("#industry_ratio_select_hidden").val("");
    $("#sort_value_industry_hidden").val("");
    $("#sort_value_percent_hidden").val("");
    $("#allvalue").val("");
    $("#IC0000000000_CUSTOMIZE").modal("hide");
  });
  //行业百分比保存按钮触发事件
  $("button[id='IC0000000000_INDUSTRY_savebtn_1']").on("click", function () {
    var form = "IC0000000000_INDUSTRY_FORM";
    var value1 = KyFromUtil.getItemValue(form, "INDUSTRY_RATIO_SELECT");//获取字段值
    var value_num1 = KyFromUtil.getItemValue(form, "SORT_VALUE_INDUSTRY");//获取字段值
    if (isNull(value1) || isNull(value_num1)) {
      $("#IC0000000000_INDUSTRY_error").show();
      $('#IC0000000000_INDUSTRY_FORM_error_text').text("请选择行业或输入数值!");
      return;
    } else {
      $("#IC0000000000_INDUSTRY_error").hide();
      $('#IC0000000000_INDUSTRY_FORM_error_text').text("");
    }
    if(!new RegExp("^([1-9][0-9]{0,1}|100|[0-9][0-9]{0,1}\\.[0-9]{0,2})$").test(value_num1)){

      $("#IC0000000000_INDUSTRY_error").show();
      $('#IC0000000000_INDUSTRY_FORM_error_text').text("请输入大于0小于等于100的数值,且最大输入小数点后两位！");
      return;
    }else {
      $("#IC0000000000_INDUSTRY_error").hide();
      $('#IC0000000000_INDUSTRY_FORM_error_text').text("");
    }
    if(value_num1==0.0 && value_num1==0.00){
      $("#IC0000000000_INDUSTRY_error").show();
      $('#IC0000000000_INDUSTRY_FORM_error_text').text("请输入大于0小于等于100的数值,且最大输入小数点后两位！");
      return;
    }else {
      $("#IC0000000000_INDUSTRY_error").hide();
      $('#IC0000000000_INDUSTRY_FORM_error_text').text("");
    }
    //$("body").data("customize_val",value+"△"+value_num);
    var hisval = ($("#conditional-expression>option:nth-last-child(3)").val()).split("@")[0];
    var hy_name = $("#INDUSTRY_RATIO_SELECT").find("option:selected").text();
    $("#conditional-expression>option:nth-last-child(3)").val(hisval + "@" + value1 + "△" + value_num1+"△%");

    $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(" + hy_name + "前" + value_num1 + "%)");
    $("#industry_ratio_select_hidden").val(value1);
    $("#sort_value_industry_hidden").val(value_num1);
    $("#customize_ratio_select_hidden").val("");
    $("#sort_value_customize_hidden").val("");
    $("#sort_value_percent_hidden").val("");
    $("#allvalue").val("");
    $("#IC0000000000_INDUSTRY").modal("hide");
  });
  //百分比保存按钮触发事件
  $("button[id='IC0000000000_PERCENT_savebtn_1']").on("click", function () {
    var form = "IC0000000000_PERCENT_FORM";
    var value_num2 = KyFromUtil.getItemValue(form, "SORT_VALUE_PERCENT");//获取字段值
    if (isNull(value_num2)) {
      $("#IC0000000000_PERCENT_error").show();
      $('#IC0000000000_PERCENT_FORM_error_text').text("请输入数值!");
      return;
    } else {
      $("#IC0000000000_PERCENT_error").hide();
      $('#IC0000000000_PERCENT_FORM_error_text').text("");
    }
    if(!new RegExp("^([1-9][0-9]{0,1}|100|[0-9][0-9]{0,1}\\.[0-9]{0,2})$").test(value_num2)){

      $("#IC0000000000_PERCENT_error").show();
      $('#IC0000000000_PERCENT_FORM_error_text').text("请输入大于0小于等于100的数值,且最大输入小数点后两位！");
      return;
    }else {
      $("#IC0000000000_PERCENT_error").hide();
      $('#IC0000000000_PERCENT_FORM_error_text').text("");
    }
    if(value_num2==0.0 && value_num2==0.00){
      $("#IC0000000000_PERCENT_error").show();
      $('#IC0000000000_PERCENT_FORM_error_text').text("请输入大于0小于等于100的数值,且最大输入小数点后两位！");
      return;
    }else {
      $("#IC0000000000_PERCENT_error").hide();
      $('#IC0000000000_PERCENT_FORM_error_text').text("");
    }


    var hisval = ($("#conditional-expression>option:nth-last-child(2)").val()).split("@")[0];
    $("#conditional-expression>option:nth-last-child(2)").val(hisval + "@" + value_num2);

    $("#conditional-expression").parent().find("span:eq(0)").text("百分比排名(" + "前" + value_num2 + "%)");
    $("#sort_value_percent_hidden").val(value_num2);

    $("#industry_ratio_select_hidden").val("");
    $("#sort_value_industry_hidden").val("");
    $("#customize_ratio_select_hidden").val("");
    $("#sort_value_customize_hidden").val("");
    $("#allvalue").val("");
    $("#IC0000000000_PERCENT").modal("hide");
  });
  //行业关闭按钮触发事件
  $("button[id='IC0000000000_CUSTOMIZE_closebtn']").on("click", function () {
    //获取hidden里面的值
    var  names= $("#industry_ratio_select_hidden").val();
    var  nums= $("#sort_value_industry_hidden").val();
    var  names1= $("#customize_ratio_select_hidden").val();
    var  nums1= $("#sort_value_customize_hidden").val();
    var  nums2= $("#sort_value_percent_hidden").val();
    var  allvalues=$("#allvalue").val();
    if(!isNull(names) && !isNull(nums)){
      $("#conditional-expression>option:nth-last-child(3)").val("industry@" + names + "△"+nums+"△%");
      $("#s2id_conditional-expression").select2("val",["industry@" + names + "△"+nums+"△%"]);
      if (names == "MC1000400010") {
        names="申万一级子行业";
      } else if (names == "MC1000400020") {
        names="申万二级子行业";
      } else if (names == "MC1000400030") {
        names="申万三级子行业";
      } else if (names == "MC1000300010") {
        names="中信一级子行业";
      } else if (names == "MC1000300020") {
        names="中信二级子行业";
      } else if (names == "MC1000300030") {
        names="中信三级子行业";
      } else if (names == "MC1000500010") {
        names="证监会一级子行业";
      } else if (names == "MC1000500020") {
        names="证监会二级子行业";
      } else if (names == "MC1000500030") {
        names="证监会三级子行业";
      }
      $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(" + names + "前" + nums + "%)");
      $("#IC0000000000_INDUSTRY").modal("hide");
    }else if(!isNull(names1) && !isNull(nums1)){
      $("#conditional-expression>option:last-child").val("customize@" + names1 + "△"+nums1);
      $("#s2id_conditional-expression").select2("val",["customize@" + names1 + "△"+nums1]);
      if (names1 == "MC1000400010") {
        names1="申万一级子行业";
      } else if (names1 == "MC1000400020") {
        names1="申万二级子行业";
      } else if (names1 == "MC1000400030") {
        names1="申万三级子行业";
      } else if (names1 == "MC1000300010") {
        names1="中信一级子行业";
      } else if (names1 == "MC1000300020") {
        names1="中信二级子行业";
      } else if (names1 == "MC1000300030") {
        names1="中信三级子行业";
      } else if (names1 == "MC1000500010") {
        names1="证监会一级子行业";
      } else if (names1 == "MC1000500020") {
        names1="证监会二级子行业";
      } else if (names1 == "MC1000500030") {
        names1="证监会三级子行业";
      }
      $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(" + names1 + "前" + nums1 + "名)");
      $("#IC0000000000_CUSTOMIZE").modal("hide");
    }else if(!isNull(nums2)){
      $("#conditional-expression>option:nth-last-child(2)").val("percent@"+nums2);
      $("#s2id_conditional-expression").select2("val",["percent@"+nums2]);
      $("#conditional-expression").parent().find("span:eq(0)").text("百分比排名(" + "前" + nums2 + "%)");
      $("#IC0000000000_PERCENT").modal("hide");
    }else  if(!isNull(allvalues)) {
      if (allvalues == "all") {
        allvalues = "全部";
        $("#s2id_conditional-expression").select2("val",["all"]);
      } else if (allvalues == "fifty") {
        allvalues = "前50名";
        $("#s2id_conditional-expression").select2("val",["fifty"]);
      } else if (allvalues == "onehundred") {
        allvalues = "前100名";
        $("#s2id_conditional-expression").select2("val",["onehundred"]);
      } else if (allvalues == "threehundred") {
        allvalues = "前300名";
        $("#s2id_conditional-expression").select2("val",["threehundred"]);
      }
    }else{
      $("#conditional-expression").select2("val", ["all"]);
    }
  });
  //行业百分比关闭按钮触发事件
  $("button[id='IC0000000000_INDUSTRY_closebtn']").on("click", function () {
    //获取hidden里面的值
    var  names= $("#industry_ratio_select_hidden").val();
    var  nums= $("#sort_value_industry_hidden").val();
    var  names1= $("#customize_ratio_select_hidden").val();
    var  nums1= $("#sort_value_customize_hidden").val();
    var  nums2= $("#sort_value_percent_hidden").val();
    var  allvalues=$("#allvalue").val();
    if(!isNull(names) && !isNull(nums)){
      $("#conditional-expression>option:nth-last-child(3)").val("industry@" + names + "△"+nums+"△%");
      $("#s2id_conditional-expression").select2("val",["industry@" + names + "△"+nums+"△%"]);
      if (names == "MC1000400010") {
        names="申万一级子行业";
      } else if (names == "MC1000400020") {
        names="申万二级子行业";
      } else if (names == "MC1000400030") {
        names="申万三级子行业";
      } else if (names == "MC1000300010") {
        names="中信一级子行业";
      } else if (names == "MC1000300020") {
        names="中信二级子行业";
      } else if (names == "MC1000300030") {
        names="中信三级子行业";
      } else if (names == "MC1000500010") {
        names="证监会一级子行业";
      } else if (names == "MC1000500020") {
        names="证监会二级子行业";
      } else if (names == "MC1000500030") {
        names="证监会三级子行业";
      }
      $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(" + names + "前" + nums + "%)");
      $("#IC0000000000_INDUSTRY").modal("hide");
    }else if(!isNull(names1) && !isNull(nums1)){
      $("#conditional-expression>option:last-child").val("customize@" + names1 + "△"+nums1);
      $("#s2id_conditional-expression").select2("val",["customize@" + names1 + "△"+nums1]);
      if (names1 == "MC1000400010") {
        names1="申万一级子行业";
      } else if (names1 == "MC1000400020") {
        names1="申万二级子行业";
      } else if (names1 == "MC1000400030") {
        names1="申万三级子行业";
      } else if (names1 == "MC1000300010") {
        names1="中信一级子行业";
      } else if (names1 == "MC1000300020") {
        names1="中信二级子行业";
      } else if (names1 == "MC1000300030") {
        names1="中信三级子行业";
      } else if (names1 == "MC1000500010") {
        names1="证监会一级子行业";
      } else if (names1 == "MC1000500020") {
        names1="证监会二级子行业";
      } else if (names1 == "MC1000500030") {
        names1="证监会三级子行业";
      }
      $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(" + names1 + "前" + nums1 + "名)");
      $("#IC0000000000_CUSTOMIZE").modal("hide");
    }else if(!isNull(nums2)){
      $("#conditional-expression>option:nth-last-child(2)").val("percent@"+nums2);
      $("#s2id_conditional-expression").select2("val",["percent@"+nums2]);
      $("#conditional-expression").parent().find("span:eq(0)").text("百分比排名(" + "前" + nums2 + "%)");
      $("#IC0000000000_PERCENT").modal("hide");
    }else  if(!isNull(allvalues)) {
      if (allvalues == "all") {
        allvalues = "全部";
        $("#s2id_conditional-expression").select2("val",["all"]);
      } else if (allvalues == "fifty") {
        allvalues = "前50名";
        $("#s2id_conditional-expression").select2("val",["fifty"]);
      } else if (allvalues == "onehundred") {
        allvalues = "前100名";
        $("#s2id_conditional-expression").select2("val",["onehundred"]);
      } else if (allvalues == "threehundred") {
        allvalues = "前300名";
        $("#s2id_conditional-expression").select2("val",["threehundred"]);
      }
    }else{
      $("#conditional-expression").select2("val", ["all"]);
    }
  });

  //百分比关闭按钮触发事件
  $("button[id='IC0000000000_PERCENT_closebtn']").on("click", function () {
    //获取hidden里面的值
    var  names= $("#industry_ratio_select_hidden").val();
    var  nums= $("#sort_value_industry_hidden").val();
    var  names1= $("#customize_ratio_select_hidden").val();
    var  nums1= $("#sort_value_customize_hidden").val();
    var  nums2= $("#sort_value_percent_hidden").val();
    var  allvalues=$("#allvalue").val();
    if(!isNull(names) && !isNull(nums)){
      $("#conditional-expression>option:nth-last-child(3)").val("industry@" + names + "△"+nums+"△%");
      $("#s2id_conditional-expression").select2("val",["industry@" + names + "△"+nums+"△%"]);
      if (names == "MC1000400010") {
        names="申万一级子行业";
      } else if (names == "MC1000400020") {
        names="申万二级子行业";
      } else if (names == "MC1000400030") {
        names="申万三级子行业";
      } else if (names == "MC1000300010") {
        names="中信一级子行业";
      } else if (names == "MC1000300020") {
        names="中信二级子行业";
      } else if (names == "MC1000300030") {
        names="中信三级子行业";
      } else if (names == "MC1000500010") {
        names="证监会一级子行业";
      } else if (names == "MC1000500020") {
        names="证监会二级子行业";
      } else if (names == "MC1000500030") {
        names="证监会三级子行业";
      }
      $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(" + names + "前" + nums + "%)");
      $("#IC0000000000_INDUSTRY").modal("hide");
    }else if(!isNull(names1) && !isNull(nums1)){
      $("#conditional-expression>option:last-child").val("customize@" + names1 + "△"+nums1);
      $("#s2id_conditional-expression").select2("val",["customize@" + names1 + "△"+nums1]);
      if (names1 == "MC1000400010") {
        names1="申万一级子行业";
      } else if (names1 == "MC1000400020") {
        names1="申万二级子行业";
      } else if (names1 == "MC1000400030") {
        names1="申万三级子行业";
      } else if (names1 == "MC1000300010") {
        names1="中信一级子行业";
      } else if (names1 == "MC1000300020") {
        names1="中信二级子行业";
      } else if (names1 == "MC1000300030") {
        names1="中信三级子行业";
      } else if (names1 == "MC1000500010") {
        names1="证监会一级子行业";
      } else if (names1 == "MC1000500020") {
        names1="证监会二级子行业";
      } else if (names1 == "MC1000500030") {
        names1="证监会三级子行业";
      }
      $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(" + names1 + "前" + nums1 + "名)");
      $("#IC0000000000_CUSTOMIZE").modal("hide");
    }else if(!isNull(nums2)){
      $("#conditional-expression>option:nth-last-child(2)").val("percent@"+nums2);
      $("#s2id_conditional-expression").select2("val",["percent@"+nums2]);
      $("#conditional-expression").parent().find("span:eq(0)").text("百分比排名(" + "前" + nums2 + "%)");
      $("#IC0000000000_PERCENT").modal("hide");
    }else  if(!isNull(allvalues)) {
      if (allvalues == "all") {
        allvalues = "全部";
        $("#s2id_conditional-expression").select2("val",["all"]);
      } else if (allvalues == "fifty") {
        allvalues = "前50名";
        $("#s2id_conditional-expression").select2("val",["fifty"]);
      } else if (allvalues == "onehundred") {
        allvalues = "前100名";
        $("#s2id_conditional-expression").select2("val",["onehundred"]);
      } else if (allvalues == "threehundred") {
        allvalues = "前300名";
        $("#s2id_conditional-expression").select2("val",["threehundred"]);
      }
    }else{
      $("#conditional-expression").select2("val", ["all"]);
    }

  });
  //市盈率pe运算符（自定义关闭事件）
  $("button[id='IC1000300010_OPT_closebtn']").on("click",function () {
    var indexNo = $("#IC1000300010_OPT").data("indexNo");
    var sort_type= $("#SORT_TYPE_44_hidden").val();
    var sort_value=$("#SORT_VALUE_44_hidden").val();
    if(sort_type=="" && sort_value==""){
      $("#s2id_operatorSelect_" + indexNo).select2("data",{id: "", text: "--请选择--"});
    }else{
      $("#operatorSelect_" + indexNo).parent().find("div > a > span").eq(0)
        .text(sort_type + " 前" + sort_value + "名");
    }
    $("#IC1000300010_OPT").modal("hide");
  });
  //市盈率pe运算符（自定义保存事件）2200
  $("button[id='IC1000300010_OPT_savebtn_1']").on("click", function () {
    var form = "IC1000300010_OPT_FORM";
    var value = KyFromUtil.getItemValue(form, "SORT_TYPE_44");//获取字段值
    var ins_val = KyFromUtil.getItemValue(form, "syl_custom_ins_select");
    $("#shi").val(ins_val);
    if (isNull(value)) {
      $("#IC1000300010_OPT_FORM_error").show();
      $('#IC1000300010_OPT_FORM_error_text').text("请选择取值!");
      return;
    } else {
      var value_num = KyFromUtil.getItemValue(form, "SORT_VALUE_44");//获取字段值

      if (isNull(value_num)) {
        $("#IC1000300010_OPT_FORM_error").show();
        $('#IC1000300010_OPT_FORM_error_text').text("请填写数值!");
        return;
      } else {
        $("#IC1000300010_OPT_FORM_error").hide();
      }
    }
    var indexNo = $("#IC1000300010_OPT").data("indexNo");
    specialValObj["IC1000300010_" + indexNo] = {
      SORT_TYPE_44: $("#SORT_TYPE_44").val(),
      SORT_VALUE_44: $("#SORT_VALUE_44").val(),
      syl_custom_ins_select: ins_val
    };
    $("#specialVal_" + indexNo).val("tbfa_custom_rank□" + $("#SORT_TYPE_44").val() + "@" + $("#SORT_VALUE_44").val() + "@" + ins_val);
    $("#IC1000300010_OPT").modal("hide");
    var select_ = $("#SORT_TYPE_44 option:selected").text();
    var num_val = $("#SORT_VALUE_44").val();
    $("#operatorSelect_" + indexNo).parent().find("div > a > span").eq(0)
      .text(select_ + " 前" + num_val + "名");
    $("#SORT_TYPE_44_hidden").val(select_);
    $("#SORT_VALUE_44_hidden").val(num_val);
  });
  //沪深300成分权重（自定义关闭事件）
  $("button[id='IC1000400010_OPT_closebtn']").on("click",function () {
    var indexNo = $("#IC1000400010_OPT").data("indexNo");
    var sort_type= $("#SORT_TYPE_45_hidden").val();
    var sort_value=$("#SORT_VALUE_45_hidden").val();
    if(sort_type=="" && sort_value==""){
      $("#s2id_operatorSelect_" + indexNo).select2("data",{id: "", text: "--请选择--"});
    }else{
      $("#operatorSelect_" + indexNo).parent().find("div > a > span").eq(0)
        .text(sort_type + " 前" + sort_value + "名");
    }
    $("#IC1000400010_OPT").modal("hide");
  });
  //沪深300成分权重（自定义保存事件）
  $("button[id='IC1000400010_OPT_savebtn_2']").on("click", function () {
    var form = "IC1000400010_OPT_FORM";
    var value = KyFromUtil.getItemValue(form, "SORT_TYPE_45");//获取字段值
    var ins_val = KyFromUtil.getItemValue(form, "hs300_custom_ins_select");
    $("#huShen").val(ins_val);
    if (isNull(value)) {
      $("#IC1000400010_OPT_error").show();
      $('#IC1000400010_OPT_error_text').text("请选择取值!");
      return;
    } else {
      var value_num = KyFromUtil.getItemValue(form, "SORT_VALUE_45");//获取字段值

      if (isNull(value_num)) {
        $("#IC1000400010_OPT_error").show();
        $('#IC1000400010_OPT_error_text').text("请填写数值!");
        return;
      } else {
        $("#IC1000400010_OPT_error").hide();
      }
    }

    var indexNo = $("#IC1000400010_OPT").data("indexNo");
    specialValObj["IC1000400010_" + indexNo] = {
      SORT_TYPE_45: $("#SORT_TYPE_45").val(),
      SORT_VALUE_45: $("#SORT_VALUE_45").val(),
      hs300_custom_ins_select: ins_val
    };
    $("#specialVal_" + indexNo).val("tbga_custom_rank□" + $("#SORT_TYPE_45").val() + "@" + $("#SORT_VALUE_45").val() + "@" + ins_val);
    $("#IC1000400010_OPT").modal("hide");
    var select_ = $("#SORT_TYPE_45 option:selected").text();
    var num_val = $("#SORT_VALUE_45").val();
    $("#operatorSelect_" + indexNo).parent().find("div > a > span").eq(0)
      .text(select_ + " 前" + num_val + "名");
    $("#SORT_TYPE_45_hidden").val(select_);
    $("#SORT_VALUE_45_hidden").val(num_val);
  });
  //hidden值的判断
  function handleHiddenValue(hiddenValueval) {
    var prefix = "";
    if(hiddenValueval.indexOf("1000")>0){
      prefix = "行业均值";
    }else if(hiddenValueval.indexOf("year")>0){
      prefix = "历史均值";
    }else if(hiddenValueval.indexOf("asj")>0){
      prefix = "历史均值";
    }else if(hiddenValueval.indexOf("industry")>0){
      prefix = "行业均值";
    }
    if(hiddenValueval == "asy_csi500_middle"){
      return  hiddenValueval="中证500PE中位数";
    }else if(hiddenValueval == "asy_ssi300_middle"){
      return  hiddenValueval="沪深300PE中位数";
    } else if (hiddenValueval == "recent_five_years") {
      return prefix+"(最近5年)";
    } else if (hiddenValueval == "recent_ten_years") {
      return prefix+"(最近10年)";
    } else if (hiddenValueval == "2005_to_now") {
      return prefix+"(2005-01-01至今)";
    }else if (hiddenValueval == "MC1000400010") {
      return prefix+"（申万一级子行业）";
    } else if (hiddenValueval == "MC1000400020") {
      return prefix+"（申万二级子行业)";
    } else if (hiddenValueval == "MC1000400030") {
      return prefix+"（申万三级子行业)";
    } else if (hiddenValueval == "MC1000300010") {
      return prefix+"（中信一级子行业）";
    } else if (hiddenValueval == "MC1000300020") {
      return prefix+"(中信二级子行业）";
    } else if (hiddenValueval == "MC1000300030") {
      return prefix+"（中信三级子行业）";
    } else if (hiddenValueval == "MC1000500010") {
      return prefix+"（证监会一级子行业）";
    } else if (hiddenValueval == "MC1000500020") {
      return prefix+"（证监会二级子行业）";
    } else if (hiddenValueval == "MC1000500030") {
      return prefix+"（证监会三级子行业）";
    }else{
      return hiddenValueval;
    }
  }

  //营业收入（自定义的关闭事件）
  $("button[id='IC10002000300070_OPT_closebtn']").on("click",function () {
    var indexNo = $("#IC10002000300070_OPT").data("indexNo");
    var sort_option= $("#SORT_OPTION_1122_hidden").val();
    var sort_value= $("#SORT_VALUE_1122_hidden").val();
    if(sort_option=="" && sort_value==""){
      $("#s2id_operatorSelect_" + indexNo).select2("data",{id: "", text: "--请选择--"});
    }else{
      $("#operatorSelect_" + indexNo).parent().find("div > a > span").eq(0)
        .text(sort_option + " 前" + sort_value + "名");
    }
    $("#IC10002000300070_OPT").modal("hide");
  });
  //营业收入（自定义的保存事件）
  $("button[id='IC10002000300070_OPT_savebtn_2']").on("click", function () {

    var form = "IC10002000300070_OPT_FORM";
    var value = KyFromUtil.getItemValue(form, "SORT_OPTION_1122");//获取字段值
    if (isNull(value)) {
      $("#IC10002000300070_OPT_error").show();
      $('#IC10002000300070_OPT_error_text').text("请选择取值!");
      return;
    } else {
      var value_num = KyFromUtil.getItemValue(form, "SORT_VALUE_1122");//获取字段值

      if (isNull(value_num)) {
        $("#IC10002000300070_OPT_error").show();
        $('#IC10002000300070_OPT_error_text').text("请填写数值!");
        return;
      } else {
        $("#IC10002000300070_OPT_error").hide();
        $("#yysr").val($("#SORT_OPTION_1122").select2("data"));
        $("#yysr2").val($("#SORT_VALUE_1122").val());
      }
    }

    var indexNo = $("#IC10002000300070_OPT").data("indexNo");
    specialValObj["IC10002000300070_" + indexNo] = {
      SORT_OPTION_1122: $("#SORT_OPTION_1122").val(),
      SORT_VALUE_1122: $("#SORT_VALUE_1122").val()
    };
    $("#specialVal_" + indexNo).val("tbye_custom_rank□" + $("#SORT_OPTION_1122").val() + "@" + $("#SORT_VALUE_1122").val());
    $("#IC10002000300070_OPT").modal("hide");
    var select_ = $("#SORT_OPTION_1122 option:selected").text();
    var num_val = $("#SORT_VALUE_1122").val();
    $("#operatorSelect_" + indexNo).parent().find("div > a > span").eq(0)
      .text(select_ + " 前" + num_val + "名");
    $("#SORT_OPTION_1122_hidden").val(select_);
    $("#SORT_VALUE_1122_hidden").val(num_val);
  });
  //资产负债率（行业选择关闭按钮逻辑处理）
  $("button[id='debt_ratio_closebtn_1']").on("click",function () {
    var indexNo = $("#debt_ratio").data("indexNo");
    var hiddenVal= $("#selectValueInput_" + indexNo + "_hiddenval").val();
    $("#selectValueInput_" + indexNo).parent().find("span:eq(0)").text(handleHiddenValue(hiddenVal));
    $("#debt_ratio").modal("hide");
  });
  //资产负债率（行业选择保存按钮逻辑处理）
  $("button[id='debt_ratio_savebtn_1']").on("click", function () {
    var fu = $("#debt_ratio_select").val();
    var indexNo = $("#debt_ratio").data("indexNo");
    //获取下拉框的值
    $("#selectValueInput_" + indexNo + "_hiddenval").val(fu);
    $("#selectValueInput_" + indexNo + "_hiddentext").val(handleHiddenValue(fu));
    if ($('#debt_ratio_select option:selected').text() != null && $('#debt_ratio_select option:selected').text() != '') {
      $("#fuZhai").val(fu);
      $("#debt_ratio_select_error").hide();
    } else {
      $("#debt_ratio_select_error").show();
      $('#debt_ratio_select_error').text("行业选择字段是必须的");
      return;
    }
    var indexNo = $("#debt_ratio").data("indexNo");
    specialValObj["IC10002000100010_" + indexNo] = {
      debt_ratio_select: $("#debt_ratio_select").val()
    };
    $("#specialVal_" + indexNo).val("tbba_industry_select□" + $("#debt_ratio_select").val());
    $("#debt_ratio").modal("hide");
    var v = $("#debt_ratio_select option:selected").text();
    $("#selectValueInput_" + indexNo)
      .parent().find("div > a > span").eq(0).text("行业资产负债率(" + v + ")");
  });
  $("#debt_ratio_select").on("change", function () {
    if ($('#debt_ratio_select option:selected').text() != null && $('#debt_ratio_select option:selected').text() != '') {
      $("#debt_ratio_select_error").hide();
    }
  });
  $("input[name='tbdh_report_range']").on("change", function () {
    var raido_val = $("input[name='tbdh_report_range']:checked").val();
    if (raido_val == 'reportPeriod') {
      //报告期
      $("#IC10002000300050_form").find("select[id='tbdh_single_quarter_unit']").attr("readonly", true);
      $("#IC10002000300050_form").find("select[id='tbdh_single_quarter_report_year']").attr("readonly", true);
      $("#IC10002000300050_form").find("select[id='tbdh_report_year']").attr("readonly", false);
      $("#IC10002000300050_form").find("select[id='tbdh_report_unit']").attr("readonly", false);
      KyFromUtil.removeItemRequired("IC10002000300050_form", "tbdh_single_quarter_report_year");
      KyFromUtil.removeItemRequired("IC10002000300050_form", "tbdh_single_quarter_unit");
      KyFromUtil.removeItemRequired("IC10002000300050_form", "tbdh_single_quarter_report_year", "");
      KyFromUtil.removeItemRequired("IC10002000300050_form", "tbdh_single_quarter_unit", "");
      KyFromUtil.setItemRequired("IC10002000300050_form", "tbdh_report_year", "报告期");//设置必填字段
      KyFromUtil.setItemRequired("IC10002000300050_form", "tbdh_report_unit", "报告期");//设置必填字段
    } else if (raido_val == 'singleQuarter') {
      //单季度
      $("#IC10002000300050_form").find("select[id='tbdh_report_year']").attr("readonly", true);
      $("#IC10002000300050_form").find("select[id='tbdh_report_unit']").attr("readonly", true);
      $("#IC10002000300050_form").find("select[id='tbdh_single_quarter_unit']").attr("readonly", false);
      $("#IC10002000300050_form").find("select[id='tbdh_single_quarter_report_year']").attr("readonly", false);
      KyFromUtil.removeItemRequired("IC10002000300050_form", "tbdh_report_year");
      KyFromUtil.removeItemRequired("IC10002000300050_form", "tbdh_report_unit");
      KyFromUtil.setItemValue("IC10002000300050_form", "tbdh_report_year", "");
      KyFromUtil.setItemValue("IC10002000300050_form", "tbdh_report_unit", "");
      KyFromUtil.setItemRequired("IC10002000300050_form", "tbdh_single_quarter_report_year", "单季度");//设置必填字段
      KyFromUtil.setItemRequired("IC10002000300050_form", "tbdh_single_quarter_unit", "单季度");//设置必填字段
    }
  });

  //行业均值弹框页面的关闭按钮逻辑（市盈率PE）
  $("#syl_ins_avg_closebtn_1").on("click",function () {

    var indexNo = $("#syl_ins_avg").data("indexNo");
    var hiddenVal= $("#selectValueInput_" + indexNo + "_hiddenval").val();
    var hiddenVals= $("#selectValueInput_" + indexNo + "_hiddenvals").val();
    $("#selectValueInput_" + indexNo).parent().find("span:eq(0)").text(handleHiddenValue(hiddenVal));
    $("#selectValueInput_" + indexNo).val(hiddenVals);
    $("#syl_ins_avg").modal("hide");
  });
  //行业均值弹框页面的保存按钮逻辑（市盈率PE）
  $("button[id='syl_ins_avg_savebtn_1']").on("click", function () {

    var form = "syl_ins_avg";
    //选择的值
    var indexNo = $("#syl_ins_avg").data("indexNo");
    var value = $("#syl_ins_avg_ins_select").val();
    var values=$("#selectValueInput_" + indexNo).val();
    $("#selectValueInput_" + indexNo + "_hiddenvals").val(values);
    //获取下拉框的值
    $("#selectValueInput_" + indexNo + "_hiddenval").val(value);
    $("#selectValueInput_" + indexNo + "_hiddentext").val(handleHiddenValue(value));
    //提示信息处理

    if (isNull(value)) {
      $("#syl_ins_avg_error").show();
      $('#syl_ins_avg_error_text').text("请把行业选择的数据填写完整!");
      return;
    } else {
      $("#sylpb").val(value);
      $("#syl_ins_avg_error").hide();
      $('#syl_ins_avg_error_text').text("");
    }

    var indexNo = $("#syl_ins_avg").data("indexNo");
    //将选择的值奖金specialValObj对象中
    if (specialValObj["IC1000300010_" + indexNo]) {
      specialValObj["IC1000300010_" + indexNo]["syl_ins_avg_ins_select"] = $("#syl_ins_avg_ins_select").val();
    } else {
      specialValObj["IC1000300010_" + indexNo] = {};
      specialValObj["IC1000300010_" + indexNo]["syl_ins_avg_ins_select"] = $("#syl_ins_avg_ins_select").val();
    }
    $("#specialVal_" + indexNo).val("tbfa_ins_value□" + $("#syl_ins_avg_ins_select").val());
    $("#syl_ins_avg").modal("hide");
    //下拉选选中的值
    var v = $("#syl_ins_avg_ins_select option:selected").text();
    $("#selectValueInput_" + indexNo)
      .parent().find("div > a > span").eq(0).text("行业均值(" + v + ")");
  });

  //行业均值弹框页面的关闭按钮逻辑（市净率PB
  $("#sjl_ins_avg_closebtn_1").on("click",function () {

    var indexNo = $("#sjl_ins_avg").data("indexNo");
    var hiddenVal= $("#selectValueInput_" + indexNo + "_hiddenval").val();
    var hiddenVals= $("#selectValueInput_" + indexNo + "_hiddenvals").val();
    $("#selectValueInput_" + indexNo).parent().find("span:eq(0)").text(handleHiddenValue(hiddenVal));
    $("#selectValueInput_" + indexNo).val(hiddenVals);
    $("#sjl_ins_avg").modal("hide");
  });
  //行业均值弹框页面的保存按钮逻辑（市净率PB）
  $("button[id='sjl_ins_avg_savebtn_1']").on("click", function () {

    var form = "sjl_ins_avg";
    var indexNo = $("#sjl_ins_avg").data("indexNo");
    var value = $("#sjl_ins_avg_ins_select").val();
    var values=$("#selectValueInput_" + indexNo).val();
    $("#selectValueInput_" + indexNo + "_hiddenvals").val(values);
    //获取下拉框的值
    $("#selectValueInput_" + indexNo + "_hiddenval").val(value);
    $("#selectValueInput_" + indexNo + "_hiddentext").val(handleHiddenValue(value));
    if (isNull(value)) {
      $("#sjl_ins_avg_error").show();
      $('#sjl_ins_avg_error_text').text("请把行业选择的数据填写完整!");
      return;
    } else {
      $("#zhishucunfang").val(value);
      $("#sjl_ins_avg_error").hide();
      $('#sjl_ins_avg_error_text').text("");
    }


    var indexNo = $("#sjl_ins_avg").data("indexNo");
    if (specialValObj["IC1000300020_" + indexNo]) {
      specialValObj["IC1000300020_" + indexNo]["sjl_ins_avg_ins_select"] = $("#sjl_ins_avg_ins_select").val();
    } else {
      specialValObj["IC1000300020_" + indexNo] = {};
      specialValObj["IC1000300020_" + indexNo]["sjl_ins_avg_ins_select"] = $("#sjl_ins_avg_ins_select").val();
    }
    $("#specialVal_" + indexNo).val("tbfb_ins_value□" + $("#sjl_ins_avg_ins_select").val());
    $("#sjl_ins_avg").modal("hide");
    var v = $("#sjl_ins_avg_ins_select option:selected").text();
    $("#selectValueInput_" + indexNo)
      .parent().find("div > a > span").eq(0).text("行业均值(" + v + ")");
  });
  //历史均值弹框的关闭按钮点击事件（市盈率PE）
  $("button[id='syl_his_avg_closebtn_1']").on("click",function () {

    var indexNo = $("#syl_his_avg").data("indexNo");
    var radio= $("#selectValueInput_" + indexNo + "_hiddenval").val();
    var hiddenVals= $("#selectValueInput_" + indexNo + "_hiddenvals").val();
    $("#selectValueInput_" + indexNo).parent().find("span:eq(0)").text(handleHiddenValue(radio));
    $("#selectValueInput_" + indexNo).val(hiddenVals);
    $("#syl_his_avg").modal("hide");
  });

  //历史均值弹框的保存按钮点击事件（市盈率PE）
  $("button[id='syl_his_avg_savebtn_1']").on("click", function () {

    var form = "syl_his_avg_form";
    var value = KyFromUtil.getItemValue(form, "syl_his_avg_range");//获取字段值

    if (isNull(value)) {
      $("#syl_his_avg_error").show();
      $('#syl_his_avg_error_text').text("请把历史区间的数据填写完整!");
      return;
    } else {
      if (value == "custom_range") {
        //检测两项
        var syl_his_avg_from = KyFromUtil.getItemValue(form, "syl_his_avg_from");//获取字段值
        var syl_his_avg_to = KyFromUtil.getItemValue(form, "syl_his_avg_to");//获取字段值

        if (isNull(syl_his_avg_from) || isNull(syl_his_avg_to)) {
          $("#syl_his_avg_error").show();
          $('#syl_his_avg_error_text').text("请把历史区间的数据填写完整!");
          return;
        }
      } else {
        $("#syl_his_avg_error").hide();
      }
    }


    var indexNo = $("#syl_his_avg").data("indexNo");
    if (specialValObj["IC1000300010_" + indexNo]) {
      specialValObj["IC1000300010_" + indexNo]["syl_his_avg_range"] = $("input[name='syl_his_avg_range']:checked").val();
    } else {
      specialValObj["IC1000300010_" + indexNo] = {};
      specialValObj["IC1000300010_" + indexNo]["syl_his_avg_range"] = $("input[name='syl_his_avg_range']:checked").val();
    }
    if ($("input[name='syl_his_avg_range']:checked").val() == "custom_range") {
      specialValObj["IC1000300010_" + indexNo]["syl_his_avg_from"] = $("#syl_his_avg_from").val();
      specialValObj["IC1000300010_" + indexNo]["syl_his_avg_to"] = $("#syl_his_avg_to").val();
      $("#specialVal_" + indexNo).val("tbfa_his_value□" + $("input[name='syl_his_avg_from']").val() + "△" + $("input[name='syl_his_avg_to']").val());
    } else {
      $("#specialVal_" + indexNo).val("tbfa_his_value□" + $("input[name='syl_his_avg_range']:checked").val());
    }
    $("#syl_his_avg").modal("hide");
    var values=$("#selectValueInput_" + indexNo).val();
    $("#selectValueInput_" + indexNo + "_hiddenvals").val(values);
    //获取值存到hidden
    $("#selectValueInput_" + indexNo + "_hiddenval").val($("input[name='syl_his_avg_range']:checked").val());
    var radio_ = $("input[name='syl_his_avg_range']:checked").val();
    var str = "";
    if (radio_ == "recent_five_years") {
      str = "最近5年";
    } else if (radio_ == "recent_ten_years") {
      str = "最近10年";
    } else if (radio_ == "2005_to_now") {
      str = "2005-01-01至今";
    } else if (radio_ == "custom_range") {
      var start = $("input[name='syl_his_avg_from']").val();
      var end = $("input[name='syl_his_avg_to']").val();
      str = start + " 至 " + end;
    }
    //history
    $("#selectValueInput_" + indexNo)
      .parent().find("div > a > span").eq(0).text("历史均值(" + str + ")");
  });
  //历史均值弹框的关闭按钮点击事件（市净率PB）
  $("button[id='sjl_his_avg_closebtn_1']").on("click",function () {

    var indexNo = $("#sjl_his_avg").data("indexNo");
    var radio= $("#selectValueInput_" + indexNo + "_hiddenval").val();
    var hiddenVals= $("#selectValueInput_" + indexNo + "_hiddenvals").val();
    $("#selectValueInput_" + indexNo).parent().find("span:eq(0)").text(handleHiddenValue(radio));
    $("#selectValueInput_" + indexNo).val(hiddenVals);
    $("#sjl_his_avg").modal("hide");
  });

  //历史均值弹框的保存按钮点击事件（市净率PB）
  $("button[id='sjl_his_avg_savebtn_1']").on("click", function () {

    var form = "sjl_his_avg_form";
    var value = KyFromUtil.getItemValue(form, "sjl_his_avg_range");//获取字段值

    if (isNull(value)) {
      $("#sjl_his_avg_error").show();
      $('#sjl_his_avg_error_text').text("请把历史区间的数据填写完整!");
      return;
    } else {
      if (value == "custom_range") {
        //检测两项
        var syl_his_avg_from = KyFromUtil.getItemValue(form, "sjl_his_avg_from");//获取字段值
        var syl_his_avg_to = KyFromUtil.getItemValue(form, "sjl_his_avg_to");//获取字段值

        if (isNull(syl_his_avg_from) || isNull(syl_his_avg_to)) {
          $("#sjl_his_avg_error").show();
          $('#sjl_his_avg_error_text').text("请把历史区间的数据填写完整!");
          return;
        }
      } else {
        $("#sjl_his_avg_error").hide();
      }
    }


    var indexNo = $("#sjl_his_avg").data("indexNo");
    if (specialValObj["IC1000300020_" + indexNo]) {
      specialValObj["IC1000300020_" + indexNo]["sjl_his_avg_range"] = $("input[name='sjl_his_avg_range']:checked").val();
    } else {
      specialValObj["IC1000300020_" + indexNo] = {};
      specialValObj["IC1000300020_" + indexNo]["sjl_his_avg_range"] = $("input[name='sjl_his_avg_range']:checked").val();
    }
    if ($("input[name='sjl_his_avg_range']:checked").val() == "custom_range") {
      specialValObj["IC1000300020_" + indexNo]["sjl_his_avg_from"] = $("#sjl_his_avg_from").val();
      specialValObj["IC1000300020_" + indexNo]["sjl_his_avg_to"] = $("#sjl_his_avg_to").val();
      $("#specialVal_" + indexNo).val("tbfb_his_value□" + $("input[name='sjl_his_avg_from']").val() + "△" + $("input[name='sjl_his_avg_to']").val());
    } else {
      $("#specialVal_" + indexNo).val("tbfb_his_value□" + $("input[name='sjl_his_avg_range']:checked").val());
    }
    $("#sjl_his_avg").modal("hide");
    var radio_ = $("input[name='sjl_his_avg_range']:checked").val();
    var values=$("#selectValueInput_" + indexNo).val();
    $("#selectValueInput_" + indexNo + "_hiddenvals").val(values);
    //获取值存到hidden
    $("#selectValueInput_" + indexNo + "_hiddenval").val($("input[name='sjl_his_avg_range']:checked").val());
    var str = "";
    if (radio_ == "recent_five_years") {
      str = "最近5年";
    } else if (radio_ == "recent_ten_years") {
      str = "最近10年";
    } else if (radio_ == "2005_to_now") {
      str = "2005-01-01至今";
    } else if (radio_ == "custom_range") {
      var start = $("input[name='sjl_his_avg_from']").val();
      var end = $("input[name='sjl_his_avg_to']").val();
      str = start + " 至 " + end;
    }
    $("#selectValueInput_" + indexNo)
      .parent().find("div > a > span").eq(0).text("历史均值(" + str + ")");
  });
  $("button[id$='_selectall']").on("click", function () {
    var modalid = $(this).prop("id").substring(0, $(this).prop("id").lastIndexOf("_"));
    initIndustryDegreeZtreeObjs[modalid + "_obj"].checkAllNodes(true);
  });
  $("button[id$='_unselectall']").on("click", function () {
    var modalid = $(this).prop("id").substring(0, $(this).prop("id").lastIndexOf("_"));
    initIndustryDegreeZtreeObjs[modalid + "_obj"].checkAllNodes(false);
  });
  $("#exportPlateInfo").on("click",function(){
    var param = {"strategyId":$("#strId").val(),"viewFlag":$("#viewFlag").val()};
    CreateDownLoadForm('/app/sharePolicy/page/strategy/exportPlateInfo', param);
  })
});


function radix(flag, date, i) {
  // if(!flag){
  // 	i += 1;
  // }
  return date = date - i;
}

$("input[name='radio_index']").on("change", function () {
  initPage();
  indexParamObj = {};
  specialValObj = {};
  indexNo_map_indexSerialNo = {};
  _indexCount = 0;
  initRunForm();
  $("#myAlert").css("display", "none");
  $("#stock_range").val("");//重置隐藏字段,防止香港市场切换问题
  $("#currentSelectRange").val("");
});

(function () {
  $("input[value='radio_index_compare']").prop("checked", true);
  initPage();
})();

function isRadioIndexSort() {
  return $("input[value='radio_index_compare']").prop("checked");
}

/*********************************策略修改************************************************/
/*if(!isNull(strategyUpdateId)){
			$("#strategyModel").css("display","none");
			strategyUpdatInit();
		}*/
initRunForm();

// 全角转半角
function ToCDB(str) {
  var tmp = "";
  if (str.match(/[\u4e00-\u9fa5]/g)) {
    // 如果是汉字转为空
    return tmp;
  }
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) == 12288) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
      continue;
    }
    if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
    }
    else {
      tmp += String.fromCharCode(str.charCodeAt(i));
    }
  }
  return tmp;
}

//1.初始化结束


function setInitParams() {
  if (isRadioIndexSort()) {
    marketCategoryTreeSettings = {
      check: {enable: false},
      callback: {onClick: selectMarketCategoryNode, beforeClick: marketCategoryNodeBeforeClick}
    };
    indexCategoryTreeSettings = {
      check: {enable: false},
      data : {key:{title:"dataExplain"}},
      callback: {onClick: indexCategoryTreeOnClick, beforeClick: indexCategoryTreeBeforeClick}
    };
    pageRightHtml = "<div class='portlet-body'><div class='panel panel-default portlet box blue-steel'>" +
      "<div class='panel-heading portlet-title'><div class='caption'><i class='fa fa-thumb-tack'></i>比较选股：条件列表</div>" +
      "<div class='tools'><a href='#' class='collapse' title='展开/折叠'></a></div></div>" +
      "<div class='panel-body portlet-body form-horizontal'>" +
      "<div class='form-group' id='strategyModel'><label class='control-label col-xs-2' for=''>当前选股模板：</label>" +
      "<div class='col-xs-10'>" +
      "<div class='table-container  input-group input-group-sm' id='select_Table'>" +
      "<div class='table-actions-wrapper form-group'>" +
      "<form class='form-inline' role='form'>\n" +
      " <div class='form-group' style=\"padding-left:15px;\">\n" +
      " <div class='input-group input-group-sm'>\n" +
      " <div class='input-group-addon'>方案名称：</div>\n" +
      " <input  style='margin-top:1px'  class='form-control form-filter input-sm' name='search_vcStrategyName_cn'/>\n" +
      " </div>\n" +
      " </div>\n" +
      "<div class='form-group' style=\"padding-left:30px;\">\n" +
      "<div class='input-group input-group-sm'>\n" +
      " <button class='btn btn-sm filter-submit btn-default filter-submit'><i class='fa fa fa-search'></i> 搜索</button>\n" +
      " </div>\n" +
      " </div>\n" +
      " </form>"+
      "</div></div>" +
      "</div></div>" +
      // "<div class='form-group'><label class='control-label col-xs-2' for=''>当前选股模板：</label>"+
      // "<div class='col-xs-10'><select id='currentSelectModel' class='form-control form-control-new select2-allow-clear select2 input-sm select2-offscreen'></select>"+
      // "</div></div>"+
      "<div class='form-group'><label class='control-label col-xs-2' for=''>当前选股范围：</label>" +
      "<div class='col-xs-10'  style='width:530px;'><input id='currentSelectRange' readonly type='text' class='form-control form-control-new'>" +
      "</div></div>" +

      "</div></div><div style='overflow:auto;width:100%;height:210px;'>" +
      "<form name='indexsTable' id='indexsTable'>" +
      "<table class='table table-striped table-bordered table-hover' id='pa_table' >" +
      "<thead class='tableClass'><tr><th>序号</th><th>股票指标</th><th>参数</th><th>运算符</th><th>数值</th><th>单位</th><th>操作</th></tr></thead>" +
      "<tbody id='tbodyId'></tbody></table></form></div></div>" +
      "<div class='input-group select2-bootstrap-prepend'> <span class='input-group-addon'>条件表达式：</span>" +
      "<div class='input-group  input-daterange' > " +
      "<input id='condition_expression' class='form-control form-control-new' type='text' style='ime-mode:disabled'  />" +
      " <span class='input-group-btn'><button type='button' class='btn blue default' id='save_choosestock_model'><i class='fa fa-save'></i>保存选股模板</button></span><span class='input-group-btn'><button id='execute_choose_stocks' class='btn blue default' type='button'>" +
      "<i class='fa fa-arrow-circle-right'></i>执行选股</button></span></div></div><div><p><div class='btn-group'>" +
      "<button type='button' class='btn blue  default' id='clearChooseConditions'>清除选股条件</button></div><div class='btn-group'>" +
      "<button type='button' class='btn blue default' id='save_plan_myblock'>保存板块</button> </div><div class='btn-group'>" +
      "<button type='button' class='btn blue default' id='save_plan_block_join'>合并板块</button> </div><div class='btn-group'>" +
      " <button type='button' class='btn blue default' id='save_plan'>保存策略</button> </div>" +
      "<div class='btn-group'><a class='btn blue default dropdown-toggle' data-toggle='dropdown'>导出 <i class='fa fa-angle-down'></i></a> " +
      "<ul class='dropdown-menu'> <li> <a id='exportExcel'>导出到EXCEL</a></li><li><a id='exportExcelWithConditions'>导出到EXCEL（带选股条件）</a></li> </ul>" +
      "</div></p></div><div style='' id='stockResults'></div>";//overflow:auto;width:100%;height: 253px;
  } else {
    marketCategoryTreeSettings = {
      check: {enable: false},
      callback: {onClick: selectMarketCategoryNode, beforeClick: marketCategoryNodeBeforeClick}
    };
    indexCategoryTreeSettings = {
      check: {enable: false},
      callback: {onClick: sortIndexCategoryTreeOnCheck, beforeClick: indexCategoryTreeBeforeClick}
    };
    pageRightHtml = "<div class='portlet-body'><div class='panel panel-default portlet box blue-steel'>" +
      "<div class='panel-heading portlet-title'><div class='caption'><i class='fa fa-thumb-tack'></i>" +
      "指标排序评分选股：条件列表</div><div class='tools'><a href='#' class='collapse' title='展开/折叠'></a>" +
      "</div></div><div class='panel-body portlet-body form-horizontal'>" +
      "<div class='form-group' id='strategyModel'><label class='control-label col-xs-2' for=''>当前选股模板：</label>" +
      "<div class='col-xs-10' >" +
      "<div class='table-container  input-group input-group-sm' id='select_Table'><div class='table-actions-wrapper form-group'>" +
      "<form class='form-inline' role='form'>" +
      "<div class='form-group' style='padding-left:15px;'>" +
      "<div class='input-group input-group-sm'>" +
      "<div class='input-group-addon'>方案名称：</div>" +
      "<input class='form-control form-filter input-sm' name='search_vcStrategyName_cn'/>" +
      "</div>" +
      "</div>" +
      "<div class='form-group' style='padding-left:32px;'>" +
      "<div class='input-group input-group-sm'>" +
      "<button class='btn btn-sm filter-submit btn-default filter-submit'><i class='fa fa fa-search'></i> 搜索</button>" +
      "</div>" +
      " </div>" +
      "</form>"+
      "</div></div>" +
      "</div></div>" +
      "<div class='form-group'>" +
      "<label class='control-label col-xs-2' for=''>当前选股范围：</label><div class='col-xs-10'  style='width:530px;'>" +
      "<input id='currentSelectRange' readonly type='text' class='form-control form-control-new'></div></div></div></div>" +
      "<div style='overflow:auto;width:100%;height:188px;'><form name='indexsTable' id='indexsTable'><table class='table table-striped table-bordered" +
      " table-hover' id='pa_table' ><thead class='tableClass'><tr><th>序号</th><th>指标</th><th>参数</th><th>配比权重 &nbsp;" +
      "<input class='proportioning_weight_check' type='checkbox'> 等权重<span></span></th><th>排序得分规则</th>" +
      "<th>操作</th></tr></thead><tbody id='tbodyId'></tbody></table></form></div></div><div class='input-group" +
      " select2-bootstrap-prepend'> <span class='input-group-addon'>条件表达式：sum (排序得分*权重)&nbsp;&nbsp;&nbsp;&nbsp;" +
      "输出结果:由高到低</span><div class='input-group input-daterange' ><input type='hidden' value='all' id='allvalue'>" +
      " <select id='conditional-expression' class='form-control form-control-new select2-allow-clear select2 input-sm select2-offscreen'>" +
      "<option value='all'>全部</option><option value='fifty'>前50名</option><option value='onehundred'>前100名</option><option value='threehundred'>前300名</option>" +"<option value='industry'>行业百分比排名</option>"+"<option value='percent'>百分比排名</option>"+
      "<option value='customize'>行业排名</option>" +
      "</select><span class='input-group-btn'><button id='conditional-expression-btn' class='btn blue btn-sm' type='button'><i class='fa fa-exchange'></i>自定义</button></span>" +
      "<span class='input-group-btn'><button type='button' class='btn blue  default' id='save_choosestock_model1'><i class='fa fa-save'></i>保存选股模板</button></span><span class='input-group-btn'><button id='execute_choose_stocks_2' class='btn blue btn-sm' type='button'>" +
      "<i class='fa fa-arrow-circle-right'></i>执行选股</button></span></div></div>" +
      "<div><p><div class='btn-group'><button type='button' class='btn blue  default' id='clearChooseConditions'>清除选股条件</button></div><div class='btn-group'>" +
      "<button type='button' class='btn blue default' id='save_plan_myblock'>保存板块</button> </div><div class='btn-group'>" +
      "<button type='button' class='btn blue default' id='save_plan_block_join'>合并板块</button> </div><div class='btn-group'>" +
      " <button type='button' class='btn blue default' id='save_plan'>保存策略</button> </div>" +
      "<div class='btn-group'><a class='btn blue default dropdown-toggle' data-toggle='dropdown'>导出 <i class='fa fa-angle-down'></i></a>" +
      "<ul class='dropdown-menu'><li><a id='exportExcel'>导出到EXCEL</a></li><li><a id='exportExcelWithConditions'>导出到EXCEL（带选股条件）</a>" +
      "</li></ul></div></p></div><div style='' id='stockResults'></div>";//overflow:auto;width:100%;
  }
}

//2.初始化页面
function initPage() {
  strategyNameArr = [];
  indexParamObj = {};
  specialValObj = {};
  indexNo_map_indexSerialNo = {};
  _indexCount = 0;
  strategyModelStatusArr = {};
  $("#marketCategoryTree").empty();
  $("#indexCategoryTree").empty();//清空左侧指标分类模块的树内容
  $("#page-right-cur").empty();
  setInitParams();

  $("#page-right-cur").append(pageRightHtml);
  initSelect2Tables();
  //自定义
  $("#conditional-expression-btn").on("click", function () {
    //ceshi
    if ($("#conditional-expression").prop("tagName").match("INPUT")) {
      $("#conditional-expression").remove();
      $("#conditional-expression-btn").parent().before("<select id='conditional-expression' class='form-control form-control-new select2-allow-clear select2 input-sm select2-offscreen'>" +
        "<option value='all'>全部</option><option value='fifty'>前50名</option><option value='onehundred'>前100名</option><option value='threehundred'>前300名</option><option value='industry'>行业百分比排名</option><option value='percen'>百分比排名</option><option value='customize'>行业排名</option>" +
        "</select>");
      $("#conditional-expression").select2({allowClear: true});
      $("#conditional-expression").on('select2-close', function (e) {
        var whereValue = $("#conditional-expression option:selected").val();
        if (whereValue.split("@")[0] === "customize") {
          $('#IC0000000000_CUSTOMIZE_FORM_error_text').text("");
          var value=$("#s2id_CUSTOMIZE_RATIO_SELECT").select2("val",[""+$("#customize_ratio_select_hidden").val()+""]);
          var value_num=$("#SORT_VALUE_CUSTOMIZE").val($("#sort_value_customize_hidden").val());
          $("#IC0000000000_CUSTOMIZE").modal("show");//行业排名页面
        }else if(whereValue.split("@")[0]==="percent"){
          $('#IC0000000000_PERCENT_FORM_error_text').text("");
          var value_num1=$("#SORT_VALUE_PERCENT").val($("#sort_value_percent_hidden").val());
          $("#IC0000000000_PERCENT").modal("show");//百分比排名页面
        }else if(whereValue.split("@")[0]==="industry"){
          $('#IC0000000000_INDUSTRY_FORM_error_text').text("");
          var value1=$("#s2id_INDUSTRY_RATIO_SELECT").select2("val",[""+$("#industry_ratio_select_hidden").val()+""]);
          var value_num1=$("#SORT_VALUE_INDUSTRY").val($("#sort_value_industry_hidden").val());
          $("#IC0000000000_INDUSTRY").modal("show");//行业百分比排名页面
        }
      });
    } else {
      $("#s2id_conditional-expression").remove();
      $("#conditional-expression").remove();
      $("#conditional-expression-btn").parent().before("<input id='conditional-expression' class='form-control form-control-new' oninput='OnlyNum(this);' type='number'" +
        " min='1' style='ime-mode:disabled' />");
    }
  });

  $("#conditional-expression").on('select2-close', function (e) {
    var whereValue = $("#conditional-expression option:selected").val();
    var value=$("#s2id_CUSTOMIZE_RATIO_SELECT").select2("val",[""]);
    var value_num=$("#SORT_VALUE_CUSTOMIZE").val("");
    var value_num1=$("#SORT_VALUE_PERCENT").val("");
    var value1=$("#s2id_INDUSTRY_RATIO_SELECT").select2("val",[""]);
    var value_num1=$("#SORT_VALUE_INDUSTRY").val("");
    if(whereValue.split("@")[0] === "all"){
      $("#customize_ratio_select_hidden").val("");
      $("#sort_value_customize_hidden").val("");
      $("#industry_ratio_select_hidden").val("");
      $("#sort_value_industry_hidden").val("");
      $("#sort_value_percent_hidden").val("");
      var alls=$("#allvalue").val(whereValue);
    }else if(whereValue.split("@")[0] === "fifty"){
      $("#customize_ratio_select_hidden").val("");
      $("#sort_value_customize_hidden").val("");
      $("#industry_ratio_select_hidden").val("");
      $("#sort_value_industry_hidden").val("");
      $("#sort_value_percent_hidden").val("");
      var fiftys=$("#allvalue").val(whereValue);
    }else if(whereValue.split("@")[0] === "onehundred"){
      $("#customize_ratio_select_hidden").val("");
      $("#sort_value_customize_hidden").val("");
      $("#industry_ratio_select_hidden").val("");
      $("#sort_value_industry_hidden").val("");
      $("#sort_value_percent_hidden").val("");
      var onehundreds=$("#allvalue").val(whereValue);
    }else if(whereValue.split("@")[0] === "threehundred"){
      $("#customize_ratio_select_hidden").val("");
      $("#sort_value_customize_hidden").val("");
      $("#industry_ratio_select_hidden").val("");
      $("#sort_value_industry_hidden").val("");
      $("#sort_value_percent_hidden").val("");
      var threehundreds=$("#allvalue").val(whereValue);
    }
    //这是将隐藏文本框里面的值得到，再回显到页面上
    var value=$("#s2id_CUSTOMIZE_RATIO_SELECT").select2("val",[""+$("#customize_ratio_select_hidden").val()+""]);
    var value_num=$("#SORT_VALUE_CUSTOMIZE").val($("#sort_value_customize_hidden").val());
    var value_num1=$("#SORT_VALUE_PERCENT").val($("#sort_value_percent_hidden").val());
    var value1=$("#s2id_INDUSTRY_RATIO_SELECT").select2("val",[""+$("#industry_ratio_select_hidden").val()+""]);
    var value_num1=$("#SORT_VALUE_INDUSTRY").val($("#sort_value_industry_hidden").val());
    if (whereValue.split("@")[0] === "customize") {
      $('#IC0000000000_CUSTOMIZE_FORM_error_text').text("");
      $("#IC0000000000_CUSTOMIZE").modal("show");//行业排名页面
    }else if(whereValue.split("@")[0]==="percent"){
      $('#IC0000000000_PERCENT_FORM_error_text').text("");
      $("#IC0000000000_PERCENT").modal("show");//百分比排名页面
    }else if(whereValue.split("@")[0]==="industry"){
      $('#IC0000000000_INDUSTRY_FORM_error_text').text("");
      $("#IC0000000000_INDUSTRY").modal("show");//行业百分比排名页面
    }
  });

  //删除选股模板
  $("#deletePlanModel").on("click", function () {
    if (selectedStrategyModelId && strategyModelStatusArr[selectedStrategyModelId] == "0060") {
      $.ajax({
        url: _basePath + "/app/sharePolicy/page/strategyModel/delete",
        data: {
          selectedStrategyModelId: selectedStrategyModelId
        },
        async: true,
        cache: false,
        dataType: "text",
        success: function (data) {
          if (data == "success") {
            initPage();
          }

        },
        error: function (jqXHR, textStatus, errorThrown) {
          parent.kyTools.message({type: 'error', message: '删除失败'}, {closeInSeconds: 3});
        }
      });
    } else if (selectedStrategyModelId && strategyModelStatusArr[selectedStrategyModelId] == "0010") {
      parent.kyTools.message({type: 'error', message: '有效策略选股条件不可删除'}, {closeInSeconds: 3});
    } else {
      parent.kyTools.message({type: 'error', message: '请先勾选需要删除的模板'}, {closeInSeconds: 3});
    }
  });

  // 执行选股方法contains
  $("#execute_choose_stocks").on("click", function () {

    if(stamp==false){
      return  parent.kyTools.message({type: 'error', message: '请检查参数！！！'}, {closeInSeconds: 3});
    }

    if($("#currentSelectRange").val().trim()==""){
      return  parent.kyTools.message({type: 'error', message: '请选择选股范围！！！'}, {closeInSeconds: 3});
    }
    errorObj = {};
    if (KyFromUtil.validateForm("indexsTable") == false) {
      getError();
      return;
    }
    errorObj = {};
    // $("#myAlert").css("display", "none");
    planId = generateUUID();
    var isAoh = 'A'; //是否是A股
    var stockRange = $("#stock_range").val();
    if (stockRange.indexOf("MC1000600010") > -1) {
      isAoh = 'H';//港股
    }
    if (stockRange.indexOf("BOARD") > -1) {//判断板块
      if (marketCategoryTreeObj.getSelectedNodes().length > 0) {
        if (marketCategoryTreeObj.getSelectedNodes()[0].getParentNode().id == '2') {
          isAoh = 'H';
        }
      }

    }
    var indexConditionExpression = $("#condition_expression").val().replace(/\（/g,"(").replace(/\）/g,")").replace(/，/g,",");
    var indexConditionExpressionAfterEffect = "";
    var tableObjTmp = $("#indexsTable").serializeJson();
    var tmpIndexArray = [];
    var tableObj = {};//指标信息table表对象
    $.each(tableObjTmp, function (i, v) {
      var index = i.substring(i.lastIndexOf("_") + 1);
      var indexName = i.substring(0, i.lastIndexOf("_"));
      var indexNo = tableObjTmp["indexNo_" + index];
      if ("specialVal" == indexName) {
        if ($("#specialVal_" + index).val() && $("#specialVal_" + index).val().indexOf('□') > -1) {
          var attrName = $("#specialVal_" + index).val().substring(0, $("#specialVal_" + index).val().indexOf('□'));
          var attrVal = $("#specialVal_" + index).val().substring($("#specialVal_" + index).val().indexOf('□') + 1);
          indexParamObj[indexNo][attrName] = attrVal;
        }
      }

      if ($.inArray(index, tmpIndexArray) == -1) {
        tmpIndexArray.push(index);
        tableObj[indexNo] = {};
        tableObj[indexNo][indexName] = v;
      } else {
        tableObj[indexNo][indexName] = v;
      }
    });
    //判断条件表达式
    if (indexConditionExpression.toUpperCase().indexOf('IN') == -1) {
      if (!checkExpression(indexConditionExpression)) {
        getError();
        return;
      }
      indexConditionExpression = indexConditionExpression.replace(/\s+/g, "").trim().replace(/and/ig, ' AND ').replace(/or/ig, ' OR ').replace(/>=/g, ' GTE ').replace(/<=/g, ' LTE ').replace(/=/g, ' = ').replace(/>/g, ' > ').replace(/</g, ' < ').replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').replace(/GTE/g, ' >= ').replace(/LTE/g, ' <= ').replace(/\s+/g, " ").trim();
      var indexConditionExpressionArr = indexConditionExpression.split(" ");
      var indexConditionExpressionArrAfter = indexConditionExpression.split(" ");
      for (var i = 0, len = indexConditionExpressionArr.length; i < len; i++) {
        if (indexConditionExpressionArr[i].match(/\d+/)) {
          indexConditionExpressionArr[i] = "#" + indexConditionExpressionArr[i];
          indexConditionExpressionArrAfter[i] = "#" + indexConditionExpressionArr[i] + "#";
          indexConditionExpressionArr[i] = indexConditionExpressionArr[i].replace(/#+/g, '#');
          indexConditionExpressionArrAfter[i] = indexConditionExpressionArrAfter[i].replace(/#+/g, '#');
        }
      }
      indexConditionExpression = indexConditionExpressionArr.join(" ");
      $("#condition_expression").val(indexConditionExpression);
      indexConditionExpressionAfterEffect = indexConditionExpressionArrAfter.join(" ");
    } else {
      indexConditionExpression = indexConditionExpression.toUpperCase();
      // if(!indexConditionExpression.replace(/\s+/g,"").match(/^\d+(IN)\(#\d+((=|>|<|>=|<=|,)#\d+)+\)$/ig)){
      // 	errorObj={"表达式":["语法有误"]};
      // 	getError();
      // 	return;
      // }
      var tmpArray1 = [];
      $("input[name^='serialNo_']").each(function (i, v) {
        tmpArray1.push($(this).val());
      });
      var tmpArray2 = indexConditionExpression.split("IN")[1].replace(/\s+/g, "").replace(/>=/g, ' ').replace(/<=/g, ' ').replace(/</g, ' ').replace(/>/g, ' ').replace(/=/g, ' ').replace(/,/g, ' ').replace(/AND/ig, " ").replace(/OR/ig, " ").replace(/#|\(|\)/g, "").split(" ");
      var flag = false;
      for (var i = 0, len = tmpArray2.length; i < len; i++) {
        flag = false;
        for (var j = 0, len2 = tmpArray1.length; j < len2; j++) {
          if (tmpArray2[i] == tmpArray1[j]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          errorObj = {"表达式": ["指标" + tmpArray2[i] + "不存在"]};
          getError();
          return;
        }
      }
      var tmpExpArr = indexConditionExpression.toUpperCase().split("IN");
      indexConditionExpressionAfterEffect = "";
      var num = parseInt(tmpExpArr[0].trim());
      var tmpExp = tmpExpArr[1].trim();
      var tmpConditionArr = tmpExp.split(",");
      for (var i = 0, len = tmpConditionArr.length; i < len; i++) {
        if (i == 0 && tmpConditionArr[0].trim().startsWith("(")) {
          tmpConditionArr[0] = tmpConditionArr[0].trim();
          tmpConditionArr[0] = tmpConditionArr[0].substring(1);
        } else if (i == len - 1 && tmpConditionArr[len - 1].trim().endsWith(")")) {
          tmpConditionArr[len - 1] = tmpConditionArr[len - 1].trim();
          tmpConditionArr[len - 1] = tmpConditionArr[len - 1].substring(0, tmpConditionArr[len - 1].length - 1);
        } else {
          tmpConditionArr[i] = tmpConditionArr[i].trim();
        }
        var tmpCheckExpression = tmpConditionArr[i];
        if (!checkExpression(tmpCheckExpression)) {
          getError();
          return;
        }

      }
      var combinationArr = combination(tmpConditionArr, num);
      for (var i = 0, len = combinationArr.length; i < len; i++) {
        for (var j = 0, len2 = combinationArr[i].length; j < len2; j++) {
          if (j == 0) {
            if(num >1){
              indexConditionExpressionAfterEffect += " ( (" + combinationArr[i][j] + ") AND ";
            }else{
              indexConditionExpressionAfterEffect += "  (" + combinationArr[i][j] + ") ";
            }

          } else if (j == len2 - 1) {
            indexConditionExpressionAfterEffect += " (" + combinationArr[i][j] + ") ) ";
          } else {
            if(num>1){
              indexConditionExpressionAfterEffect += " (" + combinationArr[i][j] + ") AND ";
            }else{
              indexConditionExpressionAfterEffect += " (" + combinationArr[i][j] + ")";
            }

          }

        }
        if (i < len - 1) {
          indexConditionExpressionAfterEffect += " OR ";
        }
      }
      indexConditionExpressionAfterEffect = indexConditionExpressionAfterEffect.replace(/\s+/g, "").trim().replace(/and/ig, ' AND ').replace(/or/ig, ' OR ').replace(/>=/g, ' GTE ').replace(/<=/g, ' LTE ').replace(/=/g, ' = ').replace(/>/g, ' > ').replace(/</g, ' < ').replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').replace(/GTE/g, ' >= ').replace(/LTE/g, ' <= ').replace(/\s+/g, " ").trim();
      var indexConditionExpressionArrAfter = indexConditionExpressionAfterEffect.split(" ");
      for (var i = 0, len = indexConditionExpressionArrAfter.length; i < len; i++) {
        if (indexConditionExpressionArrAfter[i].match(/\d+/)) {
          indexConditionExpressionArrAfter[i] = "#" + indexConditionExpressionArrAfter[i] + "#";
          indexConditionExpressionArrAfter[i] = indexConditionExpressionArrAfter[i].replace(/#+/g, '#');
        }
      }
      indexConditionExpressionAfterEffect = indexConditionExpressionArrAfter.join(" ");
    }
    //提交选股
    executeAjax_1 = $.ajax({
      url: _basePath + "/app/sharePolicy/page/chooseStocks/execute",
      //contentType: "application/json",
      beforeSend: function () {
        //kyTools.blockUI();
        $("#stockResults").empty();
        $('#myModal1').modal('show');
      },
      type: "POST",
      data: {
        planId: planId,
        stockRange: stockRange,
        indexFormParam: encodeURI(JSON.stringify(indexParamObj), "UTF-8"),
        indexTableParam: encodeURI(JSON.stringify(tableObj), "UTF-8"),
        indexConditionExpression: indexConditionExpression.toUpperCase(),
        indexConditionExpressionAfterEffect: indexConditionExpressionAfterEffect,
        stockCaliber: $("input[name='radio_index']:checked").val(),
        isAoh: isAoh
      },
      async: true,
      cache: false,
      dataType: "text",
      success: function (data) {
        createStrategyResultTable("stockResults", planId, "0040");
        parent.kyTools.message({type: 'success', message: '选股成功'}, {closeInSeconds: 3});
        // kyTools.unblockUI();
        $('#myModal1').modal('hide');
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.responseText.indexOf('Session会话超时!') > -1) {
          Metronic.stopPageLoading();
          $("#sharepolicy-choosestock-id").html(jqXHR.responseText);
        } else {
          parent.kyTools.message({type: 'error', message: '选股失败'}, {closeInSeconds: 3});
          $('#myModal1').modal('hide');
        }

      }
    });
  });

  //板块保存事件
  $("#save_choosestock_model_save").unbind("click").on("click", function () {
    var formId = "save_choosestock_model_form";
    KyFromUtil.initValidate(formId);
    var modelName = $("#choosestockModelName").val();
    KyFromUtil.setItemRequired(formId, "choosestockModelName", "模版名称");
    KyFromUtil.showItem(formId, "choosestockModelName");
    //校验板块名称重复需要重新查询该用户所添加的有效策略和模块？？？  --strategyNameArr 模块名称对象
    /*        if ($.inArray(modelName, strategyNameArr) > -1) {
                    kyTools.alert({type: 'error', message: '模板名称已存在'}, {closeInSeconds: 3});
                    return;
                }*/

    if (!KyFromUtil.validateForm("save_choosestock_model_form")) { return; }
    //校验模板名称是否已被使用
    var isExit=checkModelNameExit(modelName);
    if(isExit=="false"){
      parent.kyTools.message({type: 'error', message: '模板名称已存在'}, {closeInSeconds: 3});
      return;
    }

    planId = generateUUID();
    var isAoh = 'A';
    var stockRange = $("#stock_range").val();
    if (stockRange.indexOf("MC1000600010") > -1) {
      isAoh = 'H';
    }
    if (stockRange.indexOf("BOARD") > -1) {
      if (marketCategoryTreeObj.getSelectedNodes().length > 0) {
        if (marketCategoryTreeObj.getSelectedNodes()[0].getParentNode().id == '2') {
          isAoh = 'H';
        }
      }

    }
    var indexConditionExpression = $("#condition_expression").val();
    var tableObjTmp = $("#indexsTable").serializeJson();
    var tmpIndexArray = [];
    var tableObj = {};
    $.each(tableObjTmp, function (i, v) {
      var index = i.substring(i.lastIndexOf("_") + 1);
      var indexName = i.substring(0, i.lastIndexOf("_"));
      var indexNo = tableObjTmp["indexNo_" + index];
      if (save_model_flag === "0") {
        if ("specialVal" == indexName) {
          if ($("#specialVal_" + index).val() && $("#specialVal_" + index).val().indexOf('□') > -1) {
            var attrName = $("#specialVal_" + index).val().substring(0, $("#specialVal_" + index).val().indexOf('□'));
            var attrVal = $("#specialVal_" + index).val().substring($("#specialVal_" + index).val().indexOf('□') + 1);
            indexParamObj[indexNo][attrName] = attrVal;
          }
        }
      }
      if ($.inArray(index, tmpIndexArray) == -1) {
        tmpIndexArray.push(index);
        tableObj[indexNo] = {};
        tableObj[indexNo][indexName] = v;
      } else {
        tableObj[indexNo][indexName] = v;
      }
    });
    var sUrl = "";
    if (save_model_flag == "0") {//比较选股
      //wjl 加
      indexConditionExpression=$("#condition_expression").val();
      if (indexConditionExpression.toUpperCase().indexOf("IN") == -1) {
        indexConditionExpression = indexConditionExpression.replace(/\s+/g, "").trim().replace(/and/ig, ' AND ').replace(/or/ig, ' OR ').replace(/>=/g, ' GTE ').replace(/<=/g, ' LTE ').replace(/=/g, ' = ').replace(/>/g, ' > ').replace(/</g, ' < ').replace(/\(/g, ' ( ').replace(/\)/, ' ) ').replace(/GTE/g, ' >= ').replace(/LTE/g, ' <= ').replace(/\s+/g, " ").trim();
        var indexConditionExpressionArr = indexConditionExpression.split(" ");
        for (var i = 0, len = indexConditionExpressionArr.length; i < len; i++) {
          if (indexConditionExpressionArr[i].match(/\d+/)) {
            indexConditionExpressionArr[i] = "#" + indexConditionExpressionArr[i];
            indexConditionExpressionArr[i] = indexConditionExpressionArr[i].replace(/#+/g, '#');
          }
        }
        indexConditionExpression = indexConditionExpressionArr.join(" ");
      }
      $("#condition_expression").val(indexConditionExpression);
      sUrl = _basePath + "/app/sharePolicy/page/chooseStocks/savechoosestockmodel";
    } else if (save_model_flag == "1") {//排序选股
      indexConditionExpression = $("#conditional-expression").val();
      if(indexConditionExpression.indexOf("前") != -1 == true){
        if(indexConditionExpression.indexOf("%") != -1 == true){
          var b = indexConditionExpression.split("前");
          var c = b[0].split("（");
          var a = b[1].split("%");
          if (c[1] == "申万一级子行业") {
            indexConditionExpression = "industry@MC1000400010" + "△" + a[0]+ "△%";
          } else if (c[1] == "申万二级子行业") {
            indexConditionExpression = "industry@MC1000400020" + "△" + a[0]+ "△%";
          } else if (c[1] == "申万三级子行业") {
            indexConditionExpression = "industry@MC1000400030" + "△" + a[0]+ "△%";
          } else if (c[1] == "中信一级子行业") {
            indexConditionExpression = "industry@MC1000300010" + "△" + a[0]+ "△%";
          } else if (c[1] == "中信二级子行业") {
            indexConditionExpression = "industry@MC1000300020" + "△" + a[0]+ "△%";
          } else if (c[1] == "中信三级子行业") {
            indexConditionExpression = "industry@MC1000300030" + "△" + a[0]+ "△%";
          } else if (c[1] == "证监会一级子行业") {
            indexConditionExpression = "industry@MC1000500010" + "△" + a[0]+ "△%";
          } else if (c[1] == "证监会二级子行业") {
            indexConditionExpression = "industry@MC1000500020" + "△" + a[0]+ "△%";
          } else if (c[1] == "证监会三级子行业") {
            indexConditionExpression = "industry@MC1000500030" + "△" + a[0]+ "△%";
          }
        }else{
          var b = indexConditionExpression.split("前");
          var c = b[0].split("（");
          var a = b[1].split("名");
          if (c[1] == "申万一级子行业") {
            indexConditionExpression = "customize@MC1000400010" + "△" + a[0];
          } else if (c[1] == "申万二级子行业") {
            indexConditionExpression = "customize@MC1000400020" + "△" + a[0];
          } else if (c[1] == "申万三级子行业") {
            indexConditionExpression = "customize@MC1000400030" + "△" + a[0];
          } else if (c[1] == "中信一级子行业") {
            indexConditionExpression = "customize@MC1000300010" + "△" + a[0];
          } else if (c[1] == "中信二级子行业") {
            indexConditionExpression = "customize@MC1000300020" + "△" + a[0];
          } else if (c[1] == "中信三级子行业") {
            indexConditionExpression = "customize@MC1000300030" + "△" + a[0];
          } else if (c[1] == "证监会一级子行业") {
            indexConditionExpression = "customize@MC1000500010" + "△" + a[0];
          } else if (c[1] == "证监会二级子行业") {
            indexConditionExpression = "customize@MC1000500020" + "△" + a[0];
          } else if (c[1] == "证监会三级子行业") {
            indexConditionExpression = "customize@MC1000500030" + "△" + a[0];
          }
        }

      }else {
        indexConditionExpression = $("#conditional-expression").val();
      }
      if (!indexConditionExpression) {
        indexConditionExpression = $("#conditional-expression option:selected").val();
        $("#conditional-expression option:selected").val(indexConditionExpression);
      } else {
        indexConditionExpression = $("#conditional-expression").val();
        if(indexConditionExpression.indexOf("行") != -1 == true) {
          if (indexConditionExpression.indexOf("%") != -1 == true) {
            var b = indexConditionExpression.split("前");
            var c = b[0].split("（");
            var a = b[1].split("%");
            if (c[1] == "申万一级子行业") {
              indexConditionExpression = "industry@MC1000400010" + "△" + a[0]+ "△%";
            } else if (c[1] == "申万二级子行业") {
              indexConditionExpression = "industry@MC1000400020" + "△" + a[0]+ "△%";
            } else if (c[1] == "申万三级子行业") {
              indexConditionExpression = "industry@MC1000400030" + "△" + a[0]+ "△%";
            } else if (c[1] == "中信一级子行业") {
              indexConditionExpression = "industry@MC1000300010" + "△" + a[0]+ "△%";
            } else if (c[1] == "中信二级子行业") {
              indexConditionExpression = "industry@MC1000300020" + "△" + a[0]+ "△%";
            } else if (c[1] == "中信三级子行业") {
              indexConditionExpression = "industry@MC1000300030" + "△" + a[0]+ "△%";
            } else if (c[1] == "证监会一级子行业") {
              indexConditionExpression = "industry@MC1000500010" + "△" + a[0]+ "△%";
            } else if (c[1] == "证监会二级子行业") {
              indexConditionExpression = "industry@MC1000500020" + "△" + a[0]+ "△%";
            } else if (c[1] == "证监会三级子行业") {
              indexConditionExpression = "industry@MC1000500030" + "△" + a[0]+ "△%";
            }
          }else{
            var b = indexConditionExpression.split("前");
            var c = b[0].split("（");
            var a = b[1].split("名");
            if (c[1] == "申万一级子行业") {
              indexConditionExpression = "customize@MC1000400010" + "△" + a[0];
            } else if (c[1] == "申万二级子行业") {
              indexConditionExpression = "customize@MC1000400020" + "△" + a[0];
            } else if (c[1] == "申万三级子行业") {
              indexConditionExpression = "customize@MC1000400030" + "△" + a[0];
            } else if (c[1] == "中信一级子行业") {
              indexConditionExpression = "customize@MC1000300010" + "△" + a[0];
            } else if (c[1] == "中信二级子行业") {
              indexConditionExpression = "customize@MC1000300020" + "△" + a[0];
            } else if (c[1] == "中信三级子行业") {
              indexConditionExpression = "customize@MC1000300030" + "△" + a[0];
            } else if (c[1] == "证监会一级子行业") {
              indexConditionExpression = "customize@MC1000500010" + "△" + a[0];
            } else if (c[1] == "证监会二级子行业") {
              indexConditionExpression = "customize@MC1000500020" + "△" + a[0];
            } else if (c[1] == "证监会三级子行业") {
              indexConditionExpression = "customize@MC1000500030" + "△" + a[0];
            }
          }

        } else {
          indexConditionExpression = $("#conditional-expression").val();
        }
      }

      if(indexConditionExpression.indexOf("@") != -1 == true){
        if(indexConditionExpression.indexOf("%") != -1 == true){
          var a = indexConditionExpression.split("@");
          var b = a[1].split("△");
          if (b[0] == "MC1000400010") {
            $("#conditional-expression").val("行业百分比排名（申万一级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000400020") {
            $("#conditional-expression").val("行业百分比排名（申万二级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000400030") {
            $("#conditional-expression").val("行业百分比排名（申万三级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000300010") {
            $("#conditional-expression").val("行业百分比排名（中信一级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000300020") {
            $("#conditional-expression").val("行业百分比排名（中信二级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000300030") {
            $("#conditional-expression").val("行业百分比排名（中信三级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000500010") {
            $("#conditional-expression").val("行业百分比排名（证监会一级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000500020") {
            $("#conditional-expression").val("行业百分比排名（证监会二级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000500030") {
            $("#conditional-expression").val("行业百分比排名（证监会三级子行业" + "前" + b[1] + "%）");
          }
        }else{
          var a = indexConditionExpression.split("@");
          var b = a[1].split("△");
          if (b[0] == "MC1000400010") {
            $("#conditional-expression").val("行业排名（申万一级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000400020") {
            $("#conditional-expression").val("行业排名（申万二级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000400030") {
            $("#conditional-expression").val("行业排名（申万三级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000300010") {
            $("#conditional-expression").val("行业排名（中信一级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000300020") {
            $("#conditional-expression").val("行业排名（中信二级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000300030") {
            $("#conditional-expression").val("行业排名（中信三级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000500010") {
            $("#conditional-expression").val("行业排名（证监会一级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000500020") {
            $("#conditional-expression").val("行业排名（证监会二级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000500030") {
            $("#conditional-expression").val("行业排名（证监会三级子行业" + "前" + b[1] + "名）");
          }
        }

      }else {
        $("#conditional-expression").val(indexConditionExpression);
      }


      sUrl = _basePath + "/app/sharePolicy/page/chooseStocks/savechoosestockmodel2";
    }

    $.ajax({
      url: sUrl,
      //contentType: "application/json",
      beforeSend: function () {
        $("#stockResults").empty();
      },
      type: "POST",
      data: {
        planId: planId,
        stockRange: stockRange,
        indexFormParam: encodeURI(JSON.stringify(indexParamObj), "UTF-8"),
        indexTableParam: encodeURI(JSON.stringify(tableObj), "UTF-8"),
        indexConditionExpression: indexConditionExpression,
        stockCaliber: $("input[name='radio_index']:checked").val(),
        isAoh: isAoh,
        strategyName: encodeURI(modelName, "UTF-8")
      },
      async: true,
      cache: false,
      dataType: "text",
      success: function (data) {
        $("#save_choosestock_model_modal").modal("hide");
        initPage();
        //保存模板成功后,清除页面生成的策略id
        planId = "";
        //dong改 在保存模板以后，所以不再初始化页面，而且要显示刚刚添加的选股模板名称
        //$("#select_Table .select2-chosen").text(modelName);
        parent.kyTools.message({type: 'success', message: '保存模板' + modelName + '成功'}, {closeInSeconds: 3});
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.responseText.indexOf('Session会话超时!') > -1) {
          Metronic.stopPageLoading();
          $("#sharepolicy-choosestock-id").html(jqXHR.responseText);
        } else {
          parent.kyTools.message({type: 'error', message: '保存模板失败'}, {closeInSeconds: 3});
          $('#myModal1').modal('hide');
        }
      }
    });
  });
  //保存选股模板
  $("#save_choosestock_model").on("click", function () {
    //判断是否有指标，没有指标的话提示请先添加指标
    if ($("#tbodyId tr").length == 0) {
      parent.kyTools.message({type: 'error', message: '请先添加指标'}, {closeInSeconds: 3});
      return;
    }
    save_model_flag = 0;
    $("#choosestockModelName").val("");
    $("#save_choosestock_model_modal").modal("show");
  });
  //策略刷新的调整  ----问苏威
  $("#save_choosestock_model1").on("click", function () {
    save_model_flag = 1;
    $("#choosestockModelName").val("");
    $("#save_choosestock_model_modal").modal("show");
  });


  //加法  ,修复指标比较选股精度丢失造成校验异常
  function add(arg1, arg2) {
    var r1,
      r2,
      m;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(100, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
  }


  $("#execute_choose_stocks_2").on("click", function () {
    errorObj = {};
    $("#myAlert").css("display", "none");
    var lock = false;
    var flag = true;
    var weight = 0;
    var fz = 0;
    var fm = 0;
    $.each($("input[ID^='proportioning_weight_']"), function (i, n) {
      lock = true;
      var w = $(n).val();
      if (w) {
        var d;
        if(new RegExp("^(0\.\\d{0,7})[1-9]$").test(w)){
          weight = add(weight,parseFloat(w));
        }else if (new RegExp ("^[1-9]\\d*[/][1-9]\\d*$").test(w)){
          d = w.split("/");
          weight = add(weight,(parseInt(d[0]) / parseInt(d[1])));
        }else if(new RegExp("^[1-9]\\d{0,2}%$").test(w)){
          d = w.split("%");
          weight = add(weight,parseFloat(d[0]) / 100);
        }else if(w ==1){
          weight = add(weight,parseInt(w));
        }else if(new RegExp("^(0\.\\d{0,7})$").test(w)){
          weight = add(weight,parseFloat(w));
        }
        /*if (w.indexOf(".") != -1 && w.length >= 3) {
                    //weight += parseFloat(w);
                    weight = add(weight,parseFloat(w));
                } else if ((w.indexOf("/") != -1 && w.length >= 3)) {
                    d = w.split("/");
                    //weight += (parseInt(d[0]) / parseInt(d[1]));
                    weight = add(weight,(parseInt(d[0]) / parseInt(d[1])));
                } else if (w.indexOf("%") != -1 && w.length >= 2) {
                    d = w.split("%");
                    //weight += parseFloat(d[0]) / 100;
                    weight = add(weight,parseFloat(d[0]) / 100);
                } else if (parseInt(w) == 1) {
                    //weight += parseInt(w);
                    weight = add(weight,parseInt(w));
                }*/
        else {
          errorObj = {"权重参数非法": [" 请设置百分数或者分数."]};
          flag = false;
        }
      } else {
        var msg = "请为第" + (i + 1) + "个指标";
        errorObj = {msg: [" 设置权重"]};
        flag = false;
      }
    });
    if (weight > 0.98 && weight < 1) {
      weight = 1;
    }
    if (!lock) {
      parent.kyTools.message(
        {
          "type": ""
        },
        {
          message: "请先选择指标.",
          container: $(".page-content-body"),
          place: 'prepend',
          focus: false
        }, {closeInSeconds: 3});
      return;
    }
    if (weight != 1) {
      errorObj = {
        "权重参数":
          [" 参数之和必须等于1或者100%，请检查.",
            " 参数仅可设置分数或者百分数，请检查."]
      };
      flag = false;
    }
    if (!flag || KyFromUtil.validateForm("indexsTable") == false) {
      getError();
      return;
    }
    planId = generateUUID();
    var stockRange = $("#stock_range").val();
    var tableObjTmp = $("#indexsTable").serializeJson();
    var tmpIndexArray = [];
    var tableObj = {};
    $.each(tableObjTmp, function (i, v) {
      var index = i.substring(i.lastIndexOf("_") + 1);
      var indexName = i.substring(0, i.lastIndexOf("_"));
      var indexNo = tableObjTmp["indexNo_" + index];
      if ($.inArray(index, tmpIndexArray) == -1) {
        tmpIndexArray.push(index);
        tableObj[indexNo] = {};
        tableObj[indexNo][indexName] = v;
      } else {
        tableObj[indexNo][indexName] = v;
      }
    });
    var indexConditionExpression = $("#conditional-expression").val();
    if(indexConditionExpression.indexOf("前") != -1 == true){
      if(indexConditionExpression.indexOf("%") != -1 == true){
        var b = indexConditionExpression.split("前");
        var c = b[0].split("（");
        var a = b[1].split("%");
        if (c[1] == "申万一级子行业") {
          indexConditionExpression = "industry@MC1000400010" + "△" + a[0]+ "△%";
        } else if (c[1] == "申万二级子行业") {
          indexConditionExpression = "industry@MC1000400020" + "△" + a[0]+ "△%";
        } else if (c[1] == "申万三级子行业") {
          indexConditionExpression = "industry@MC1000400030" + "△" + a[0]+ "△%";
        } else if (c[1] == "中信一级子行业") {
          indexConditionExpression = "industry@MC1000300010" + "△" + a[0]+ "△%";
        } else if (c[1] == "中信二级子行业") {
          indexConditionExpression = "industry@MC1000300020" + "△" + a[0]+ "△%";
        } else if (c[1] == "中信三级子行业") {
          indexConditionExpression = "industry@MC1000300030" + "△" + a[0]+ "△%";
        } else if (c[1] == "证监会一级子行业") {
          indexConditionExpression = "industry@MC1000500010" + "△" + a[0]+ "△%";
        } else if (c[1] == "证监会二级子行业") {
          indexConditionExpression = "industry@MC1000500020" + "△" + a[0]+ "△%";
        } else if (c[1] == "证监会三级子行业") {
          indexConditionExpression = "industry@MC1000500030" + "△" + a[0]+ "△%";
        }
      }else{
        var b = indexConditionExpression.split("前");
        var c = b[0].split("（");
        var a = b[1].split("名");
        if (c[1] == "申万一级子行业") {
          indexConditionExpression = "customize@MC1000400010" + "△" + a[0];
        } else if (c[1] == "申万二级子行业") {
          indexConditionExpression = "customize@MC1000400020" + "△" + a[0];
        } else if (c[1] == "申万三级子行业") {
          indexConditionExpression = "customize@MC1000400030" + "△" + a[0];
        } else if (c[1] == "中信一级子行业") {
          indexConditionExpression = "customize@MC1000300010" + "△" + a[0];
        } else if (c[1] == "中信二级子行业") {
          indexConditionExpression = "customize@MC1000300020" + "△" + a[0];
        } else if (c[1] == "中信三级子行业") {
          indexConditionExpression = "customize@MC1000300030" + "△" + a[0];
        } else if (c[1] == "证监会一级子行业") {
          indexConditionExpression = "customize@MC1000500010" + "△" + a[0];
        } else if (c[1] == "证监会二级子行业") {
          indexConditionExpression = "customize@MC1000500020" + "△" + a[0];
        } else if (c[1] == "证监会三级子行业") {
          indexConditionExpression = "customize@MC1000500030" + "△" + a[0];
        }
      }
    }else {
      indexConditionExpression = $("#conditional-expression").val();
    }
    executeAjax_2 = $.ajax({
      url: _basePath + "/app/sharePolicy/page/chooseStocks/execute_2",
      beforeSend: function () {
        // kyTools.blockUI();好
        $('#myModal1').modal('show');
        $("#stockResults").empty();
        return true;
      },
      //contentType: "application/json",
      type: "POST",
      data: {
        planId: planId,
        stockRange: stockRange,
        indexFormParam: encodeURI(JSON.stringify(indexParamObj), "UTF-8"),
        indexTableParam: encodeURI(JSON.stringify(tableObj), "UTF-8"),
        stockCaliber: $("input[name='radio_index']:checked").val(),
        indexConditionExpression: indexConditionExpression
      },
      async: true,
      cache: false,
      dataType: "text",
      success: function (data) {
        createStrategyResultTable("stockResults", planId, "0040");
        parent.kyTools.message({type: 'success', message: '选股成功'}, {closeInSeconds: 3});
        //kyTools.unblockUI();
        $('#myModal1').modal('hide');
      },
      error: function (xhr, ajaxOptions, thrownError) {
        if (xhr.responseText.indexOf('Session会话超时!') > -1) {
          Metronic.stopPageLoading();
          $("#sharepolicy-choosestock-id").html(xhr.responseText);
        } else {
          parent.kyTools.message({type: 'error', message: '选股失败'}, {closeInSeconds: 3});
          $('#myModal1').modal('hide');
        }
      }
    });
  });

  marketCategoryTreeObj = new GenerateZtree("MarketCategory", marketCategoryTreeSettings, "marketCategoryTree").init();
  //生成左侧指标分类模块的树内容，并获取ztree对象
  indexCategoryTreeObj = new GenerateZtree("IndexCategory", indexCategoryTreeSettings, "indexCategoryTree", {
    isFilter: "true",
    isHKStock: false
  }).init();

  document.getElementById("indexcategorytree-keyword").addEventListener("input", function () {
    var allnodes = indexCategoryTreeObj.transformToArray(indexCategoryTreeObj.getNodes());
    var pnodes = [];

    function getParentNodes(treeObj, curObj) {
      if (curObj.getParentNode() != null) {
        curObj = curObj.getParentNode();
        if ($.inArray(curObj, pnodes) == -1) {
          pnodes.push(curObj);
        }
        getParentNodes(treeObj, curObj);
      } else {
        if ($.inArray(curObj, pnodes) == -1) {
          pnodes.push(curObj);
        }
      }
    }

    //显示上次搜索后背隐藏的结点
    indexCategoryTreeObj.showNodes(index_hidden_nodes);
    var _keywords = $("#indexcategorytree-keyword").val();
    var nodes = indexCategoryTreeObj.getNodesByParamFuzzy("name", _keywords, null);

    if (nodes.length > 0) {
      for (var i = 0, len = nodes.length; i < len; i++) {
        if (nodes[i].isParent) {
          continue;
        }
        getParentNodes(indexCategoryTreeObj, nodes[i]);
      }

    }
    index_hidden_nodes = allnodes.filter(function (el) {
      return !~nodes.indexOf(el);
    });
    index_hidden_nodes = index_hidden_nodes.filter(function (e2) {
      return !~pnodes.indexOf(e2);
    });
    //隐藏不符合条件的叶子结点
    indexCategoryTreeObj.hideNodes(index_hidden_nodes);
    if (nodes.length > 0) {
      for (var i = 0, len = nodes.length; i < len; i++) {
        if (nodes[i].isParent) {
          continue;
        }
        indexCategoryTreeObj.selectNode(nodes[i]);
        break;
      }

    }
  }, false);

  //判断是否是比较选股还是排序选股
  if (isRadioIndexSort()) {
    var selectBoardNode = function (event, treeId, treeNode) {
      var marketSelectedNodes = marketCategoryTreeObj.getSelectedNodes();
      if (marketSelectedNodes.length > 0) {
        marketCategoryTreeObj.cancelSelectedNode(marketSelectedNodes[0]);
      }
      if(treeNode.checked==undefined||treeNode.checked==false){
        $.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, true, true);
      }else{
        $.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, false, false);
      }
      boardNodeOnCheck(event, treeId, treeNode);
      return;
      var parentNodeId = treeNode.getParentNode().id;
      var stockRangeBeforeChangeVal = $("#stock_range").val();
      if (parentNodeId == '2') {
        $("#indexCategoryTree").empty();
        //$("#tbodyId").empty();
        $("#stockResults").empty();
        //$("#condition_expression").val("");
        //$("#condition_expression").val("");
        //clearTmpObj();
        indexCategoryTreeObj = new GenerateZtree("IndexCategory", indexCategoryTreeSettings, "indexCategoryTree", {
          isFilter: "true",
          isHKStock: true
        }).init();
      } else {
        $("#indexCategoryTree").empty();
        //$("#tbodyId").empty();
        $("#stockResults").empty();
        //$("#condition_expression").val("");
        //clearTmpObj();
        indexCategoryTreeObj = new GenerateZtree("IndexCategory", indexCategoryTreeSettings, "indexCategoryTree", {
          isFilter: "true",
          isHKStock: false
        }).init();
      }
      $("#stock_range").val("BOARD@" + treeNode.id);
      if(!$("#stock_range").val().startsWith("BOARD@")){
        $("#currentSelectRange").val(treeNode.name);
      }else{
        $("#currentSelectRange").val(treeNode.name);
      }
    };
    var boardNodeBeforeClick = function (treeId, treeNode, clickFlag) {
      // var flag=!treeNode.isParent;
      // if(treeNode.id=="1"||treeNode.id=="2"){
      // 	flag=false;
      // }
      // return flag;
      return true;
    };

    //设置板块删除按钮是否显示
    function setBoardNodeRemoveBtn(treeId, treeNode) {
      var showBtnFlag = true;
      if (treeNode.isParent || treeNode.id == "1" || treeNode.id == "2") {
        showBtnFlag = false;
      }
      return showBtnFlag;
    }

    //删除板块的点击事件
    function boardNodeOnRemove(event, treeId, treeNode) {
      $.ajax({
        url: base + "/app/sharePolicy/page/board/deleteBoardById",
        data: {
          "boardId": treeNode.id
        },
        async: false,
        cache: false
      });
    }

    //板块删除前的操作事件
    function boardNodeBeforeRemove(treeId, treeNode) {
      var flag = false;
      $.ajax({
        url: base + "/app/sharePolicy/page/board/selectBoardIsInUse",
        data: {
          "boardId": treeNode.id
        },
        async: false,
        cache: false,
        dataType: "text",
        success: function (data) {
          if (data == "false") {
            if (confirm("您确认要删除该板块吗？")) {
              flag = true;
            }
          } else {
            parent.kyTools.message({type: 'error', message: '该板块已经被用于二次筛选操作，不可删除'}, {closeInSeconds: 3});

          }
        }
      });
      return flag;
    }

    boardTreeSetting = {
      data: {
        key: {
          //name是显示的名字，title是鼠标浮上去提示的名字全称，
          // 之所以name要用title值来表示，防止明显是的名字过长，鼠标放上去的是全称
          name: "title",
          title: "name",
        }
      },
      check: {enable: true},
      edit: {
        enable: true,
        showRemoveBtn: setBoardNodeRemoveBtn,
        showRenameBtn: setBoardNodeRemoveBtn,
        removeTitle: "删除板块",
        renameTitle: "查看板块"
      },
      callback: {
        //onClick:selectBoardNode,
        beforeClick: boardNodeBeforeClick,
        onRemove: boardNodeOnRemove,
        beforeRemove: boardNodeBeforeRemove,
        beforeEditName: boardNodeView,
        beforeCheck: boardNodeBeforeCheck,
        onCheck: boardNodeOnCheck
      }
    };
    var treeDate = getBoardZtreeData();
    boardTreeObj = new GenerateZtree("board/getBoardTreeDate",
      boardTreeSetting, "MyBoard").init();

    /**
     * 查看板块信息
     */
    function boardNodeView(treeId, treeNode) {
      boardInfoView(treeNode.id, "boardInfo");

      $("#viewboard").modal("show");
      return false;
    }

    //勾选板块前的事件
    function boardNodeBeforeCheck(treeId, treeNode) {
      var flag = !treeNode.isParent;
      if (treeNode.id == "1" || treeNode.id == "2") {
        flag = false;
      }
      var astockTreeNode = boardTreeObj.getNodeByParam("id", "1", null);
      var hstockTreeNode = boardTreeObj.getNodeByParam("id", "2", null);
      var astockTreeNodes = astockTreeNode.children;
      var hstockTreeNodes = hstockTreeNode.children;
      if (treeNode.getParentNode().id == "1") {
        if (hstockTreeNodes) {
          for (var i = 0, l = hstockTreeNodes.length; i < l; i++) {
            boardTreeObj.checkNode(hstockTreeNodes[i], false, true);
          }
        }

      } else if (treeNode.getParentNode().id == "2") {
        if (astockTreeNodes) {
          for (var i = 0, l = astockTreeNodes.length; i < l; i++) {
            boardTreeObj.checkNode(astockTreeNodes[i], false, true);
          }
        }

      }
      return flag;
    }

    //板块勾选复选事件
    function boardNodeOnCheck(event, treeId, treeNode) {
      var marketSelectedNodes = marketCategoryTreeObj.getSelectedNodes();
      if (marketSelectedNodes.length > 0) {
        marketCategoryTreeObj.cancelSelectedNode(marketSelectedNodes[0]);
      }
      var parentNodeId = treeNode.getParentNode().id;
      var stockRangeBeforeChangeVal = $("#stock_range").val();
      var checkedNodes = boardTreeObj.getCheckedNodes(true);
      if (parentNodeId == '2') {
        $("#indexCategoryTree").empty();
        //$("#tbodyId").empty();
        $("#stockResults").empty();
        //$("#condition_expression").val("");
        //clearTmpObj();
        indexCategoryTreeObj = new GenerateZtree("IndexCategory", indexCategoryTreeSettings, "indexCategoryTree", {
          isFilter: "true",
          isHKStock: true
        }).init();
      } else {
        $("#indexCategoryTree").empty();
        //$("#tbodyId").empty();
        $("#stockResults").empty();
        //$("#condition_expression").val("");
        //clearTmpObj();
        indexCategoryTreeObj = new GenerateZtree("IndexCategory", indexCategoryTreeSettings, "indexCategoryTree", {
          isFilter: "true",
          isHKStock: false
        }).init();
      }
      var checkedNodesIds = "";
      var checkedNodesNames = "";
      for (var i = 0, len = checkedNodes.length; i < len; i++) {
        if (!checkedNodes[i].isParent) {
          checkedNodesIds += "'" + checkedNodes[i].id + "',";
          checkedNodesNames += checkedNodes[i].name + ",";
        }
      }
      if (checkedNodesIds.length > 0) {
        checkedNodesIds = checkedNodesIds.substring(0, checkedNodesIds.length - 1);
        checkedNodesIds = "(" + checkedNodesIds + ")";
        checkedNodesNames = checkedNodesNames.substring(0, checkedNodesNames.length - 1);

      }
      $("#stock_range").val("BOARD@" + checkedNodesIds);
      $("#currentSelectRange").val(checkedNodesNames);
    }

    boardTreeSetting = {
      data: {
        key: {
          //name是显示的名字，title是鼠标浮上去提示的名字全称，
          // 之所以name要用title值来表示，防止明显是的名字过长，鼠标放上去的是全称
          name: "title",
          title: "name",
        }
      },
      check: {enable: true},
      edit: {
        enable: true,
        showRemoveBtn: setBoardNodeRemoveBtn,
        showRenameBtn: setBoardNodeRemoveBtn,
        removeTitle: "删除板块",
        renameTitle: "查看板块",
      },
      callback: {
        onClick: selectBoardNode,
        beforeClick: boardNodeBeforeClick,
        onRemove: boardNodeOnRemove,
        beforeRemove: boardNodeBeforeRemove,
        beforeEditName: boardNodeView,
        beforeCheck: boardNodeBeforeCheck,
        onCheck: boardNodeOnCheck
      }
    };
    var treeDate = getBoardZtreeData();
    boardTreeObj = new GenerateZtree("board/getBoardTreeDate",
      boardTreeSetting, "MyBoard").init();
  }

  setParentCheckedDisabled();//禁用父节点勾选
  if (!isRadioIndexSort()) {
    if (!index_weight) {
      $("#pa_table").find("input[id^='proportioning_weight_']").val("");
    }
    $("#conditional-expression").select2({
      allowClear: true
    });
    $(".proportioning_weight_check").bind("change", function () {
      proportioningWeightCheck();//等比权重设置
    });
  }
  //清除选股条件
  $("#clearChooseConditions").click(function () {
    indexParamObj = {};
    specialValObj = {};
    indexNo_map_indexSerialNo = {};
    _indexCount = 0;
    $("#tbodyId").find("tr").remove();
    /*  $("#zhishucunfang").val("");*/
    /* $("#fuZhai").val("");*/
    $("#huShen").val("");
    $("#shi").val("");
    /*$("#sylpb").val("");*/
    $("#yysr").val("");
    $("#yysr2").val("");
    $("#SORT_VALUE_1122").val("");
    $("#SORT_VALUE_CUSTOMIZE").val("");
    $("#SORT_VALUE_INDUSTRY").val("");
    $("#conditional-expression").val("");
    $("#customize_ratio_select_hidden").val("");
    $("#industry_ratio_select_hidden").val("");
    $("#sort_value_industry_hidden").val("");
    $("#SORT_VALUE_PERCENT").val("");
    $("#sort_value_percent_hidden").val("");
    $("#sort_value_customize_hidden").val("");
    $("#cs").val("");
    $(".proportioning_weight_check").attr("checked",false);
    $("#s2id_tboa_industry_select").select2("data",{id:"",text:""});
    $("#CUSTOMIZE_RATIO_SELECT").select2("data",{id: "", text: ""});
    $("#INDUSTRY_RATIO_SELECT").select2("data",{id:"",text:""});
    $("#s2id_SORT_OPTION_1122").select2("data",{id:"",text:""});
    $("#syl_ins_avg_ins_select").select2("data",{id: "", text: ""});
    $("#sjl_ins_avg_ins_select").select2("data",{id: "", text: ""});
    $("#s2id_debt_ratio_select").select2("data",{id: "", text: ""});
    $("#s2id_syl_custom_ins_select").select2("data",{id:"",text:""});
    $("#s2id_hs300_custom_ins_select").select2("data",{id: "", text: ""});
    $("#stock_range").val("");
    $("#currentSelectRange").val("");
    $("#condition_expression").val("");
    $("#stockResults").empty();
    var selectedStrategyModelId = "";

    var strategyModelStatusArr = {};
    planId = "";
    hasSavedPlanId = "";
    $("#conditional-expression").select2("val", ["all"]);
    $(".select2-search-choice-close").trigger("click");
    $("#select_Table_select2TableDrop").css("display", "none");
    $.fn.zTree.getZTreeObj("MyBoard").checkAllNodes(false);
  });
  var formId = "save_plan_form";
  var validateObj = {
    rules: {
      choose_stock_results: "required",
    },
    messages: {
      choose_stock_results: "对应选股结果字段是必需的",
    }
  };
  var validator = KyFromUtil.initValidate(formId, validateObj, true);

  //保存策略方案
  $("#save_plan").click(function () {
    //需要新增策略名称重复校验逻辑
    if (hasSavedPlanId != "" && hasSavedPlanId == planId) {
      parent.kyTools.message({type: 'error', message: '方案已经进行过保存操作，不可重复进行此操作'}, {closeInSeconds: 3});
      return;
    }
    validator.resetForm();
    $("#save_title_block").css("display", "none");
    $("#save_title_plan").css("display", "");
    $("#save_plan_name").css("display", "");
    $("#save_block_name").css("display", "none");
    //重置产品组合下拉选
    SharePolicy.setSelect2GroupData("setProd_select", "/app/sharePolicy/strategyInvestor/selectProd", {}, true);
    SharePolicy.setSelect2DynamicData("select_ref_stratey", "/app/sharePolicy/page/strategy/getRunStrategy", {sFlag: "0010"}, false);
    $("#save_to_new").css("display", "");
    $("#save_to_ref").css("display", "");
    $("#save_to_myblock").css("display", "none");
    $("#div_plan_strategy_ref").css("display", "none");
    $("#setProd_div").css("display", "none");
    $("#div_plan_process").css("display", "none");
    $("#div_plan_name").css("display", "none");
    $("#save_plan_modal").modal("show");
  });
  //保存到我的策略--关闭按钮
  $("#save_plan_closebtn").click(function () {
    //防止在合并板块的时候中途关闭，然后再进行保存策略操作
    KyFromUtil.setItemValue(formId, "isJoinBlock", "");
  });
  //弹框右上角'x'关闭
  $("button[class='close']").click(function () {
    KyFromUtil.setItemValue(formId, "isJoinBlock", "");
  });
  /**
   * 合并板块
   */
  $("#save_plan_block_join").click(function () {
    $("#div_select_block_number").empty();
    $("#div_view_block_join_result").empty();
    //隐藏上一次点击板块出现的板块信息
    $("#board_join_view").hide();
    var formId = "save_block_join_form";
    var validateObj = {
      rules: {
        select_myblock: "required",
      },
      messages: {
        select_myblock: "请选择合并板块字段是必需的",
      }
    };
    var validator = KyFromUtil.initValidate(formId, validateObj, true);
    validator.resetForm();
    SharePolicy.setSelect2DynamicData("select_myblock", "/app/sharePolicy/page/strategy/getRunStrategy", {sFlag: "0040"}, true);
    $("#select_myblock").val("").trigger("change");
    $("#save_block_join_modal").modal("show");
  });

  /**
   * 合并板块--合并按钮
   */
  $("#btn_block_join").click(function () {
    if (!KyFromUtil.validateForm("save_block_join_form")) {
      return;
    }
    var sBlocks = $("#select_myblock").val();
    var blockArray = sBlocks.split(",");
    var sb = "<ul class='breadcrumb' style='background-color:#ddd'>";
    var divid = "blockJoinResult('" + sBlocks + "')";
    sb += " <li><a href='jacascript:void(0)' onclick=" + divid + ">合并结果</a></li>";
    for (var i = 0; i < blockArray.length; i++) {
      var blockName = $("#select_myblock").select2('data')[i].text;
      divid = "boardInfoView('" + blockArray[i] + "','div_view_block_join_result')";
      sb += "<li><a href='jacascript:void(0)' onclick=" + divid + ">" + blockName + "</a></li>";
    }
    sb += "   </ul>";
    $("#div_select_block_number").empty();
    $("#div_select_block_number").append(sb);
    blockJoinResult(sBlocks);
  });

  /**
   * 合并板块--保存按钮
   */
  $("#btn_save_block_join").click(function () {
    //校验是否选择板块
    if (!KyFromUtil.validateForm("save_block_join_form")) {
      return;
    }
    planId = generateUUID();
    $("#save_plan").click();
    KyFromUtil.setItemValue(formId, "isJoinBlock", "YES");
  });


  /**
   * 保存板块
   */
  $("#save_plan_myblock").click(function () {
    /********************初始化表单校验************************/
    validator.resetForm();
    $("#save_title_plan").css("display", "none");
    $("#save_title_block").css("display", "");
    $("#save_plan_name").css("display", "none");
    $("#save_block_name").css("display", "");
    /********************隐藏新策略，策略刷新选项************************/
    $("#save_to_myblock").css("display", "");
    $("#save_to_new").css("display", "none");
    $("#save_to_ref").css("display", "none");
    $("#div_plan_strategy_ref").css("display", "none");
    $("#setProd_div").css("display", "none");
    $("#div_plan_process").css("display", "none");
    $("#div_plan_name").css("display", "");
    /*************************默认选择保存板块************************/
    KyFromUtil.setItemValue(formId, "choose_stock_results", "save_to_myblock");
    KyFromUtil.setItemRequired(formId, "plan_name", "方案名称");
    $("#div_condition_result").css("display", "");
    $("#expressionOrResult").css("display", "");
    //策略选股口径，判断是指标比较选股还是指标排序评分选股
    /*if(isRadioIndexSort()){
                    $("#outputResult").css("display","none");
                    $("#conditionalExpression").css("display","");
                    $("#expressionOrResult").val($("#condition_expression").val());
				}else{
                    $("#conditionalExpression").css("display","none");
                    $("#outputResult").css("display","");
                    //获取输出结果的下拉选值
                    var result = $("#conditional-expression option:selected").text();
                    if(isNull(result)){
                        result = $("#conditional-expression").val();
					}
                    //行业名称
					if(result.indexOf("行业排名") >= 0){
                        var rank = $("#conditional-expression option:selected").val().trim();
                        if(rank != null && rank != "" && !isNaN(rank.charAt(rank.length-1))){
                        	rank = rank.charAt(rank.length-1);
                            result = "行业排名("+$("#CUSTOMIZE_RATIO_SELECT").find("option:selected").text()+"前"+rank+"名)";
						}else{
                            result = "行业排名";
                        }
					}
                    $("#expressionOrResult").val(result);
				}*/
    //展示保存的面板
    $("#save_plan_modal").modal("show");
  });

  //保存方式
  $("input[name='choose_stock_results']").change(function () {
    if ($(this).val() == "save_to_myblock") {
      KyFromUtil.setItemRequired(formId, "plan_name", "方案名称");
      KyFromUtil.removeItemRequired(formId, "choose_stock_results_process");
      KyFromUtil.removeItemRequired(formId, "setProd_select");
      KyFromUtil.removeItemRequired(formId, "select_ref_stratey");
      KyFromUtil.showItem(formId, "plan_name");
      KyFromUtil.hideItem(formId, "setProd_select");
      $("#div_plan_process").css("display", "none");
      $("#submit_to_audit").css("display", "none");
      $("#submit_no_to_audit").css("display", "none");
      $("#div_plan_strategy_ref").css("display", "none");
    } else if ($(this).val() == "save_to_new") {
      KyFromUtil.setItemRequired(formId, "plan_name", "方案名称");
      KyFromUtil.setItemRequired(formId, "choose_stock_results_process", "是否提交审批");
      KyFromUtil.setItemRequired(formId, "setProd_select", "产品/虚拟组合");
      KyFromUtil.setItemValue(formId, "choose_stock_results_process", "submit_to_audit");
      KyFromUtil.removeItemRequired(formId, "select_ref_stratey");
      KyFromUtil.showItem(formId, "plan_name");
      KyFromUtil.showItem(formId, "setProd_select");
      $("#div_plan_process").css("display", "");
      $("#submit_to_audit").css("display", "");
      $("#submit_no_to_audit").css("display", "");
      $("#div_plan_strategy_ref").css("display", "none");
    } else if ($(this).val() == "save_to_ref") {
      KyFromUtil.setItemValue(formId, "choose_stock_results_process", "submit_to_audit");
      KyFromUtil.removeItemRequired(formId, "plan_name", "方案名称");
      KyFromUtil.setItemRequired(formId, "choose_stock_results_process", "是否提交审批");
      KyFromUtil.removeItemRequired(formId, "setProd_select", "产品/虚拟组合");
      KyFromUtil.setItemRequired(formId, "select_ref_stratey", "请选择刷新策略");
      $("#div_plan_process").css("display", "");
      $("#submit_to_audit").css("display", "");
      $("#submit_no_to_audit").css("display", "");
      KyFromUtil.hideItem(formId, "setProd_select");
      KyFromUtil.hideItem(formId, "plan_name");
      $("#div_plan_strategy_ref").css("display", "");
    }
  });

  $("#tbbb_saveuserbtn").click(function () {
    $.ajax({
      url: base + "/app/sharePolicy/industryUser/setUser?"+ kyTools.getUniqueID(),
      data: {
        vcUserid: $("#setUser_select").val(),
        vcIndustryCode: $("#IndustryId").val()
      },
      async: false,
      dataType: "json",
      success: function (data) {
        $("#tbbb_closeuserbtn").click();
        // TOTO 先清空table的参数条件，再赋值相关查询条件
        markGrid.clearAjaxParams();
        var checkCode=checkStockUser();
        //markGrid.setAjaxParam("search_industryName_cn", KyFromUtil.getItemValue("IndustryUser", "IndustryId"));
        //判断无行业未分配研究员则传入false，刷新table为空值
        if(isNull(checkCode)){
          checkCode="false";
        }
        markGrid.setAjaxParam("search_industryName_cn", checkCode);
        markGrid.getDataTable().ajax.reload();
      }
    });
  });

  //校验股票是否有对应行业,存在为true，不存在为false
  var cheStockIndustry = function(){
    var ret = true;
    $.ajax({
      url: _basePath + "/app/sharePolicy/page/strategy/checkStockIndustry",
      async: false,
      dataType: "text",
      cache: false,
      data: {
        strategyId: planId
      },
      //修改
      success: function (data) {
        ret = eval(data);
      }
    });
    return ret;
  };


  //效验是否存在待生效策略或者审核中状态
  var checkStrategyStatus= function(strName){
    var ret = true;
    $.ajax({
      url: _basePath + "/app/sharePolicy/page/strategy/checkStrategyStatus",
      async: false,
      dataType: "text",
      cache: false,
      data: {
        vcSerialName: strName
      },
      //修改
      success: function (data) {
        ret = eval(data);
      }
    });
    return ret;
  };
  //保存方案弹出框中的保存按钮
  $("#save_plan_btn").unbind("click").click(function () {
    if (!KyFromUtil.validateForm("save_plan_form")) {
      return;
    }
    //是否提交研究员审核
    var chooseStockResultProcess = $("input[name='choose_stock_results_process']:checked").val();

    var xin=$("[name='choose_stock_results']:checked").val();
    if(!isNull(xin)){
      if(xin=='save_to_ref'){
        var strName =$("#s2id_select_ref_stratey").select2("data").text;
        //验证在刷新策略的时候，如果存在待生效状态或者审核中状态，不可提交
        if(checkStrategyStatus(strName)){
          parent.kyTools.message({type: 'error', message: '该选股策略已提交审核，请重新设置选股条件！'}, {closeInSeconds: 3});
          return;
        }
      }
    }else{
      parent.kyTools.message({type: 'error', message: '请选择合适的策略保存方案！'}, {closeInSeconds: 3});
    }

    var code = checkStockUser();

    if (!isNull(chooseStockResultProcess)) {
      if (chooseStockResultProcess == "submit_to_audit") {
        //校验股票是否有对应行业,策略筛选结果中如果存在没有对应行业的股票，不可提交
        if(cheStockIndustry()){
          //kyTools.alert({type: 'error', message: '存在没有对应行业的股票！'}, {closeInSeconds: 3});
          //alert("存在没有行业对应的股票");
          if (!isNull(code)) {
            parent.kyTools.message({type: 'error', message: '该策略中有股票对应二级行业【'+code+'】未设置，请至菜单【投研分析】-【公司研究】-【重仓股点评】-【行业分工配置】中添加相关二级行业研究员配置'}, {closeInSeconds: 5});
          }else {
            parent.kyTools.error("存在没有行业对应的股票!");
          }
          return;
        }
      }/*else{
                if(cheStockIndustry()){
                    parent.kyTools.error("存在没有行业对应的股票!");
                    return;
                }
            }*/

    }


    /*  var code = checkStockUser();
                if (!isNull(code)) {
                    KyFromUtil.setItemValue("IndustryUser", "IndustryId", code);
                    markGrid.setAjaxParam("search_industryName_cn", code);
                    markGrid.init({
                        src: $("#industryUser_data_table"),
                        dataTable: {
                            "ajax": {
                                "url": base + "/app/sharePolicy/industryUser/getNoIndustryUserList",
                            },
                            "columns": [
                                {"data": "vcIndustryName"},
                                {"data": "vcUserName"},
                                {"data": "vcUserid", "bVisible": false},
                                {
                                    "data": "vcIndustryCode",
                                    "render": function (data, type, full, meta) {
                                        return "<a href='#' onclick='showModal(" + meta.row + ")'><span class='label label-primary'>设置</span></a>";
                                    }
                                }
                            ],
                            "ordering": false
                        }
                    });
                    $("#industry_user_div").modal("show");
            return;
        }*/
    var prodCode = $("#setProd_select").val();
    if (isNull(prodCode)) {
      prodCode = "";
    } else {
      //去重，保证下拉选中的产品和虚拟组合value唯一
      prodCode = removeDuplicationString(prodCode);
    }
    var updateStrageyId = $("#select_ref_stratey").val();
    if (isNull(updateStrageyId)) updateStrageyId = "";
    var myBlocks = $("#select_myblock").val();
    if (isNull(myBlocks)) myBlocks = "";
    var chooseStockResult = $("input[name='choose_stock_results']:checked").val();
    if (isNull(chooseStockResult)) chooseStockResult = "";
    if (isNull(chooseStockResultProcess)) chooseStockResultProcess = "";
    //表示是否为合并板块 YES表示是
    var isJoinBlock = $("#isJoinBlock").val();
    if (isNull(isJoinBlock)) isJoinBlock = "";
    $.ajax({
      url: _basePath + "/app/sharePolicy/page/savePlan",
      async: false,
      dataType: "text",
      cache: false,
      data: {
        planId: planId,
        planName: encodeURI($("#plan_name").val(), "UTF-8"),
        saveType: chooseStockResult,
        stockRange: $("#stock_range").val(),
        strategyUpdateId: updateStrageyId,
        prodCode: prodCode.toString(),
        isProcess: chooseStockResultProcess,
        myBlocks: myBlocks.toString(),
        //是否合并
        isJoinBlock: isJoinBlock

      },
      //修改
      success: function (data) {
        if (data == "false") {
          parent.kyTools.message({type: 'error', message: '请先点击执行选股'}, {closeInSeconds: 3});
          return;
        } else if (data == "isPlanNameExist") {
          parent.kyTools.message({type: 'error', message: '板块名称已存在，请重新输入'}, {closeInSeconds: 3});
          return;
        } else if (data == "isNewPlanNameExist") {
          parent.kyTools.message({type: 'error', message: '策略名称已存在，请重新输入'}, {closeInSeconds: 3});
          return;
        }
        hasSavedPlanId = planId;
        $("#save_plan_modal").modal("hide");
        $("#save_block_join_modal").modal("hide");
        if ($("input[name='choose_stock_results']:checked").val() == "save_to_myblock") {
          $("#MyBoard").empty();
          boardTreeObj = new GenerateZtree("board/getBoardTreeDate",
            boardTreeSetting, "MyBoard").init();
        }
        //清除选股条件 不把planId置为空，会导致使用同一个planId进行查询，会造成没有执行选股操作，却可以进行保存板块操作
        planId = "";
        //保存策略成功后，清除合并板块标识
        KyFromUtil.setItemValue(formId, "isJoinBlock", "");
        parent.kyTools.message({type: 'success', message: '策略保存成功！！！'}, {closeInSeconds: 3});
      }
    });
    //KyFromUtil.setItemValue(formId, "isJoinBlock", "");
  });

  //导出到EXCEL
  $("#exportExcel").click(function () {
    var conditionsValues = $("#currentSelectRange").val();
    if (conditionsValues == "" || conditionsValues == null) {
      parent.kyTools.message({type: 'error', message: '请先执行选股！！！'}, {closeInSeconds: 3});
      return;
    }
    exportExcel("/app/sharePolicy/page/export/results/noCondition");
  });
  //导出到EXCEL（带选股条件）
  $("#exportExcelWithConditions").click(function () {
    var conditionsValues = $("#currentSelectRange").val();
    if (conditionsValues == "" || conditionsValues == null) {
      parent.kyTools.message({type: 'error', message: '请先执行选股！！！'}, {closeInSeconds: 3});
      return;
    }
    exportExcel("/app/sharePolicy/page/export/results/withCondition");
  });
}

//2.初始化结束


function boardInfoView(strategyId, divId) {
  var whereId = "board";
  if (divId == "div_view_block_join_result") {
    whereId = "board_join";
    $("#board_join_view").css("display", "");
  }
  strategyList = StrategyTable.createList(strategyId, divId, whereId, "0030","");

}

function blockJoinResult(strategyId) {
  $("#board_join_view").css("display", "none");
  strategyList = StrategyTable.createList(strategyId.toString(), "div_view_block_join_result", "", "0040","");

}

function checkStockUser() {
  var rs = "";
  $.ajax({
    url: _basePath + "/app/sharePolicy/page/strategy/checkStoctNewUser",
    async: false,
    dataType: "text",
    cache: false,
    data: {
      strategyId: planId,
    },
    success: function (data) {
      rs = data;
    }
  });
  return rs;
}


var showModal = function (rowid) {
  var Data = $("#industryUser_data_table").dataTable().fnGetData(rowid);
  $("#setUser_select").val(Data.vcUserid).trigger("change");
  $("#IndustryId").val(Data.vcIndustryCode);
  $("#setUser").modal("show");
};

function exportExcel(action) {
  var downloadForm = $(document.createElement("form"));
  downloadForm.attr("action", _basePath + action);
  downloadForm.attr("method", "get");
  var planIdInput = document.createElement("input");
  $(planIdInput).attr("name", 'input_planId_name');
  if (planId == null || planId == '') {
    parent.kyTools.message({type: 'error', message:' 请先执行选股！！！'}, {closeInSeconds: 3});
    return;
  }
  $(planIdInput).val(planId);
  downloadForm.append(planIdInput);
  $("body").append(downloadForm);
  downloadForm.hide();
  downloadForm.submit();
  downloadForm.remove();
}

//点击市场分类树图节点事件
function selectMarketCategoryNode(event, treeId, treeNode) {
  var stockRangeBeforeChangeVal = $("#stock_range").val();
  $("#stock_range").val("");
  $("#currentSelectRange").val("");
  //var boardSelectedNodes = boardTreeObj.getSelectedNodes();
  //if (boardSelectedNodes.length > 0) {
  boardTreeObj.checkAllNodes(false);
  //}
  if (stockRangeBeforeChangeVal.indexOf(treeNode.id) == -1) {
    $("#stockResults").empty();
  }
  if (treeNode.id == "MC1000600010") {
    if (stockRangeBeforeChangeVal.indexOf("MC1000600010") == -1 || stockRangeBeforeChangeVal == "") {
      $("#indexCategoryTree").empty();
      $("#tbodyId").empty();
      $("#stockResults").empty();
      clearTmpObj();
      $("#condition_expression").val("");
      indexCategoryTreeObj = new GenerateZtree("IndexCategory", indexCategoryTreeSettings, "indexCategoryTree", {
        isFilter: "true",
        isHKStock: true
      }).init();
    }
  } else {
    if (stockRangeBeforeChangeVal.indexOf("MC1000600010") > -1 || stockRangeBeforeChangeVal == "") {
      $("#indexCategoryTree").empty();
      $("#tbodyId").empty();
      $("#stockResults").empty();
      $("#condition_expression").val("");
      clearTmpObj();
      indexCategoryTreeObj = new GenerateZtree("IndexCategory", indexCategoryTreeSettings, "indexCategoryTree", {
        isFilter: "true",
        isHKStock: false
      }).init();
    }
  }
  if (treeNode.id == "MC1000300010") {
    if (!initIndustryDegreeZtreeObjs.citic_degree_01_obj) {
      initIndustryDegreeZtreeObjs.citic_degree_01_obj = $.fn.zTree.init($("#citic_degree_01_ztree"), {check: {enable: true}}, getIndustryZtreeData("citic01"));
    } else {
      initIndustryDegreeZtreeObjs.citic_degree_01_obj.checkAllNodes(false);
    }
    $("#citic_degree_01").modal("show");
  } else if (treeNode.id == "MC1000300020") {
    if (!initIndustryDegreeZtreeObjs.citic_degree_02_obj) {
      initIndustryDegreeZtreeObjs.citic_degree_02_obj = $.fn.zTree.init($("#citic_degree_02_ztree"), {check: {enable: true}}, getIndustryZtreeData("citic02"));
    } else {
      initIndustryDegreeZtreeObjs.citic_degree_02_obj.checkAllNodes(false);
    }
    $("#citic_degree_02").modal("show");
  } else if (treeNode.id == "MC1000300030") {
    if (!initIndustryDegreeZtreeObjs.citic_degree_03_obj) {
      initIndustryDegreeZtreeObjs.citic_degree_03_obj = $.fn.zTree.init($("#citic_degree_03_ztree"), {check: {enable: true}}, getIndustryZtreeData("citic03"));
    } else {
      initIndustryDegreeZtreeObjs.citic_degree_03_obj.checkAllNodes(false);
    }
    $("#citic_degree_03").modal("show");
  } else if (treeNode.id == "MC1000400010") {
    if (!initIndustryDegreeZtreeObjs.sw_degree_01_obj) {
      initIndustryDegreeZtreeObjs.sw_degree_01_obj = $.fn.zTree.init($("#sw_degree_01_ztree"), {check: {enable: true}}, getIndustryZtreeData("sw01"));
    } else {
      initIndustryDegreeZtreeObjs.sw_degree_01_obj.checkAllNodes(false);
    }
    $("#sw_degree_01").modal("show");
  } else if (treeNode.id == "MC1000400020") {
    if (!initIndustryDegreeZtreeObjs.sw_degree_02_obj) {
      initIndustryDegreeZtreeObjs.sw_degree_02_obj = $.fn.zTree.init($("#sw_degree_02_ztree"), {check: {enable: true}}, getIndustryZtreeData("sw02"));
    } else {
      initIndustryDegreeZtreeObjs.sw_degree_02_obj.checkAllNodes(false);
    }
    $("#sw_degree_02").modal("show");
  } else if (treeNode.id == "MC1000400030") {
    if (!initIndustryDegreeZtreeObjs.sw_degree_03_obj) {
      initIndustryDegreeZtreeObjs.sw_degree_03_obj = $.fn.zTree.init($("#sw_degree_03_ztree"), {check: {enable: true}}, getIndustryZtreeData("sw03"));
    } else {
      initIndustryDegreeZtreeObjs.sw_degree_03_obj.checkAllNodes(false);
    }
    $("#sw_degree_03").modal("show");
  } else if (treeNode.id == "MC1000500010") {
    if (!initIndustryDegreeZtreeObjs.csrc_degree_01_obj) {
      initIndustryDegreeZtreeObjs.csrc_degree_01_obj = $.fn.zTree.init($("#csrc_degree_01_ztree"), {check: {enable: true}}, getIndustryZtreeData("csrc01"));
    } else {
      initIndustryDegreeZtreeObjs.csrc_degree_01_obj.checkAllNodes(false);
    }
    $("#csrc_degree_01").modal("show");
  } else if (treeNode.id == "MC1000500020") {
    if (!initIndustryDegreeZtreeObjs.csrc_degree_02_obj) {
      initIndustryDegreeZtreeObjs.csrc_degree_02_obj = $.fn.zTree.init($("#csrc_degree_02_ztree"), {check: {enable: true}}, getIndustryZtreeData("csrc02"));
    } else {
      initIndustryDegreeZtreeObjs.csrc_degree_02_obj.checkAllNodes(false);
    }
    $("#csrc_degree_02").modal("show");
  } else if (treeNode.id == "MC1000500030") {
    if (!initIndustryDegreeZtreeObjs.csrc_degree_03_obj) {
      initIndustryDegreeZtreeObjs.csrc_degree_03_obj = $.fn.zTree.init($("#csrc_degree_03_ztree"), {check: {enable: true}}, getIndustryZtreeData("csrc03"));
    } else {
      initIndustryDegreeZtreeObjs.csrc_degree_03_obj.checkAllNodes(false);
    }
    $("#csrc_degree_03").modal("show");
  } else {
    $("#stock_range").val("COMMON@" + treeNode.id);
    $("#currentSelectRange").val(treeNode.name);
  }
  setParentCheckedDisabled();
}

//禁用父节点勾选
function setParentCheckedDisabled() {
  var indexCategoryTreeNodes = indexCategoryTreeObj.transformToArray(indexCategoryTreeObj.getNodes());
  for (var j = 0, len = indexCategoryTreeNodes.length; j < len; j++) {
    var treeNode = indexCategoryTreeNodes[j];
    if (treeNode && treeNode.isParent) {
      // 是父节点
      indexCategoryTreeObj.setChkDisabled(treeNode, true);
    }
  }
}

//禁用市场父节点点击
function marketCategoryNodeBeforeClick(treeId, treeNode, clickFlag) {

  return !treeNode.isParent;
}

//是否选中等比权重
function proportioningWeightCheck() {
  var ck = $(".proportioning_weight_check").is(":checked");
  var weightObj = $("#pa_table").find("input[id^='proportioning_weight_']");
  weightObj.attr("readonly", ck);
  if (!index_weight) {
    weightObj.val("");//清空
  }
  var num = 0;
  $.each($("#tbodyId").find("tr"), function (i, n) {
    num++;
  });
  if (ck && num > 0) {
    var params;
    if (num == 1) {
      params = "100%";
    } else {
      params = "1/" + num;
    }
    weightObj.val(params);
  }
}

//指标排序
function sortIndexCategoryTreeOnCheck(event, treeId, treeNode) {

  _indexCount++;
  var indexNo = _indexCount;
  indexNo_map_indexSerialNo[indexNo] = treeNode.id + "_" + indexNo;
  var indexData = getIndexConfigData(treeNode.id);
  var trHtml = "<tr><td id='" + treeNode.tId + "'><div class='input-group input-group-sm'><input name='serialNo_" + indexNo + "' id='serialNo_" + indexNo + "' class='form-control form-control-new' type='text' readonly value='" + indexNo + "' style='width:20px;' /></div></td>" +
    "<td hidden><div class='input-group input-group-sm'><input name='indexNo_" + indexNo + "' readonly id='indexNo_" + indexNo + "' class='form-control form-control-new' type='text' value='" + treeNode.id + "_" + indexNo + "' /></div></td>" +
    "<td>" + treeNode.name + "</td>" +
    "<td hidden><input type='text' id='indexFullName_" + indexNo + "' name='indexFullName_" + indexNo + "' value='" + treeNode.name + "'/></td>" +
    "<td><div class='input-group input-group-sm'><input type='text' id='setParamInput_" + indexNo + "' name='setParamInput_" + indexNo + "' readonly class='form-control form-control-new input-sm'/><span class='input-group-btn'><button class='btn btn-sm blue' id='setParamBtn_" + indexNo + "' type='button'>设置</button></span></div></td>" +
    "<td hidden><input type='text' id='setParamInputHidden_" + indexNo + "' name='setParamInputHidden_" + indexNo + "'/></td>" +
    "<td> <div class='input-group-sm'><input type='text' id='proportioning_weight_" + indexNo + "' name='proportioning_weight_" + indexNo + "' class='form-control form-control-new input-sm' maxlength='10' /></div></td>" +
    "<td><div class='form-group-sm' ><select id='ranking_rule_" + indexNo + "' name='ranking_rule_" + indexNo + "' class='form-control form-control-new select2-allow-clear select2 input-sm select2-saya-" + indexNo + "'>" +
    "<option selected='' value='0'>负值并列最后一名，正值由低到高排序</option><option value='1'>全部由低到高排序</option><option value='2'>全部由高到低排序</option></select></div></td>" +
    "<td><button class='btn btn-sm blue' id='delBtn_" + indexNo + "' type='button'>删除</button></td></tr>";
  $("#tbodyId").append(trHtml);
  proportioningWeightCheck();//等比权重设置
  $(".select2-saya-" + indexNo).select2({
    allowClear: true
  });
  // 设置参数按钮事件
  $("#setParamBtn_" + indexNo).on("click", function () {
    if (indexData.indexParmaId) {
      $("#" + treeNode.id + "_form").resetForm();
      $("#" + treeNode.id + "_form").find(".select2-allow-clear").val("").trigger("change");
      var title = $("#" + treeNode.id).find(".modal-title").html();
      if (title.indexOf("(") > -1) {
        title = title.substring(0, title.indexOf("("));
        $("#" + treeNode.id).find(".modal-title").html(title);
      }
      if (indexParamObj[treeNode.id + "_" + indexNo]) {
        for (var i in indexParamObj[treeNode.id + "_" + indexNo]) {
          KyFromUtil.setItemValue(treeNode.id + "_form", i, indexParamObj[treeNode.id + "_" + indexNo][i]);
        }
        $("#" + treeNode.id).find(".modal-title").html(title + "" + $("#setParamInput_" + indexNo).val() + "");
      }
      setFromValidate(indexData.indexParmaId);
      $("#" + indexData.indexParmaId).data("indexNo", indexNo);
      if ((indexData.indexParmaId == "IC1000500020" || indexData.indexParmaId == "IC1000500010") &&
        $("#" + indexData.indexParmaId).find("input[name$='transaction_date']:checked").val() != 'recent_start_end') {
        $("#" + indexData.indexParmaId).find("input[name$='recent_start']").attr("disabled", true).attr("readonly", true);
        $("#" + indexData.indexParmaId).find("input[name$='recent_end']").attr("disabled", true).attr("readonly", true);
      }
      $("#" + indexData.indexParmaId).modal("show");
    }
  });
  // 删除指标按钮事件
  $("#delBtn_" + indexNo).on("click", function () {
    if (indexParamObj[indexNo_map_indexSerialNo[indexNo]]) {
      delete indexParamObj[indexNo_map_indexSerialNo[indexNo]];
    }


    $(this).parent().parent().remove();
    proportioningWeightCheck();//等比权重设置
  });
  setRunValidateII(indexData.indexParmaId, indexNo);
}

//数值下拉值改变事件
function bindExchangeFunction(indexNo) {
  $("#selectValueInput_" + indexNo).on("select2-close", function (e) {
    //历史均值和行业均值模态框关闭事件
    $("div[id$='_avg'],#debt_ratio").unbind("hidden.bs.modal");
    $("div[id$='_avg'],#debt_ratio").on('hidden.bs.modal', function () {
      /*  var value = KyFromUtil.getItemValue("indexsTable", "specialVal_" + indexNo);
            if (isNull(value)) {
                KyFromUtil.setItemValue("indexsTable", "selectValueInput_" + indexNo, "");
             }*/
      var radio= $("#selectValueInput_" + indexNo + "_hiddenval").val();
      if (isNull(radio)) {
        if ($(this).val() != "history_asy_avg" && $(this).val() != "industry_asy_avg" && $(this).val() != "debt_ratio" && $(this).val() != "history_asj_avg" && $(this).val() != "industry_asj_avg") {
          KyFromUtil.setItemValue("indexsTable", "selectValueInput_" + indexNo, "");
        }
      }
    });
    /*  $("#selectValueInput_" + indexNo + "_hiddenval").val($("#selectValueInput_" + indexNo).val());
          var  selectValuehidden =$("#selectValueInput_" + indexNo + "_hiddenval").val();

          alert($("#selectValueInput_" + indexNo + "_hiddenval").val());*/
    var obj = {};
    var formId = "";
    if($(this).val()!="history_asy_avg"&&$(this).val()!="industry_asy_avg"&&$(this).val()!="debt_ratio"&&$(this).val()!="history_asj_avg"&&$(this).val()!="industry_asj_avg"){
      $("#selectValueInput_" + indexNo + "_hiddenval").val($(this).val());
      $("#selectValueInput_" + indexNo + "_hiddenvals").val($(this).val());
    }

    if ($(this).val() == "history_asy_avg") {//-----------------------历史均值（市盈率）
      var hiddenValueval = $("#selectValueInput_" + indexNo + "_hiddenval").val();
      //市盈率历史均值
      $("#syl_his_avg").data("indexNo", indexNo);
      $("#syl_his_avg_form").resetForm();
      formId = "syl_his_avg_form";
      obj = specialValObj["IC1000300010_" + indexNo];
      //清除消息提示
      $("#syl_his_avg_error").hide();
      //-----------------------------------检查冻结其他输入框
      value = KyFromUtil.getItemValue("syl_his_avg_form", "syl_his_avg_range");//获取字段值
      if (isNull(value)) {
        //recent_five_years
        KyFromUtil.setItemValue("syl_his_avg_form", "syl_his_avg_range", "recent_five_years");//设置字段值
        KyFromUtil.setItemValue("syl_his_avg_form", "syl_his_avg_from", "");//设置字段值
        KyFromUtil.setItemValue("syl_his_avg_form", "syl_his_avg_to", "");//设置字段值
        KyFromUtil.setItemDisabled("syl_his_avg_form", "syl_his_avg_from", true);//设置字段锁定
        KyFromUtil.setItemDisabled("syl_his_avg_form", "syl_his_avg_to", true);//设置字段锁定

      } else if (value != "custom_range") {
        KyFromUtil.setItemValue("syl_his_avg_form", "syl_his_avg_from", "");//设置字段值
        KyFromUtil.setItemValue("syl_his_avg_form", "syl_his_avg_to", "");//设置字段值
        KyFromUtil.setItemDisabled("syl_his_avg_form", "syl_his_avg_from", true);//设置字段锁定
        KyFromUtil.setItemDisabled("syl_his_avg_form", "syl_his_avg_to", true);//设置字段锁定

        $("#syl_his_avg_error").hide();
      } else {
        KyFromUtil.setItemDisabled("syl_his_avg_form", "syl_his_avg_from", false);//设置字段锁定
        KyFromUtil.setItemDisabled("syl_his_avg_form", "syl_his_avg_to", false);//设置字段锁定

      }
      $("[name='syl_his_avg_range']").on("click", function () {//给元素绑定事件
        valu = KyFromUtil.getItemValue("syl_his_avg_form", "syl_his_avg_range");//获取字段值
        if (valu != "custom_range") {
          // KyFromUtil.removeItemRequired("syl_his_avg_form","tbab_custom_day_input");//删除字段必填
          KyFromUtil.setItemDisabled("syl_his_avg_form", "syl_his_avg_from", true);//设置字段锁定
          KyFromUtil.setItemDisabled("syl_his_avg_form", "syl_his_avg_to", true);//设置字段锁定
          KyFromUtil.setItemValue("syl_his_avg_form", "syl_his_avg_from", "");//设置字段值
          KyFromUtil.setItemValue("syl_his_avg_form", "syl_his_avg_to", "");//设置字段值
          $("#syl_his_avg_error").hide();
        } else {
          KyFromUtil.setItemDisabled("syl_his_avg_form", "syl_his_avg_from", false);//解锁字段
          KyFromUtil.setItemDisabled("syl_his_avg_form", "syl_his_avg_to", false);//解锁字段
        }
      });
      //-----------------------------------
      setTimeout(function () {
        if(hiddenValueval.indexOf("year")<0){
          $("input[name='syl_his_avg_range']:first").attr('checked', 'checked');
        }
      },300);
      $("#syl_his_avg").modal("show");

    } else if ($(this).val() == "industry_asy_avg") {//-----------------------行业均值（市盈率）
      var hiddenValueval = $("#selectValueInput_" + indexNo + "_hiddenval").val();
      //当自定义有选项为空时下拉框回到默认选项
      //行业市盈率均值
      $("#syl_ins_avg").data("indexNo", indexNo);
      $("#syl_ins_avg_form").resetForm();
      obj = specialValObj["IC1000300010_" + indexNo];
      formId = "syl_ins_avg_form";
      //清除消息提示
      $("#syl_ins_avg_error").hide();
      $("#syl_ins_avg_ins_select").bind("change", function () {
        if ($(this).val() == "") {
          $("#syl_ins_avg_error").show();
        } else {
          $("#syl_ins_avg_error").hide();
        }
      });
      /*var num2 = $("#sylpb").val();
            if(isNull(num2)){
                $("#syl_ins_avg_ins_select").select2("data",{id: "", text: ""});
                $("#syl_ins_avg_error").hide();
                $('#syl_ins_avg_error_text').text("");
                obj="";
            }*/
      setTimeout(function () {
        if(hiddenValueval.indexOf("1000")<0){
          $("#syl_ins_avg_ins_select").parent().find("span:eq(0)").text("");
        }
      },300);
      $("#syl_ins_avg").modal("show");
    } else if ($(this).val() == "history_asj_avg") {//-----------------------历史均值（市净率）
      var hiddenValueval = $("#selectValueInput_" + indexNo + "_hiddenval").val();
      //历史市净率均值
      $("#sjl_his_avg").data("indexNo", indexNo);
      $("#sjl_his_avg_form").resetForm();
      formId = "sjl_his_avg_form";
      obj = specialValObj["IC1000300020_" + indexNo];
      $("#history_asj_avg_error").hide();
      //-----------------------------------检查冻结其他输入框
      value = KyFromUtil.getItemValue("sjl_his_avg_form", "sjl_his_avg_range");//获取字段值
      if (isNull(value)) {
        //recent_five_years
        KyFromUtil.setItemValue("sjl_his_avg_form", "sjl_his_avg_range", "recent_five_years");//设置字段值
        KyFromUtil.setItemValue("sjl_his_avg_form", "sjl_his_avg_from", "");//设置字段值
        KyFromUtil.setItemValue("sjl_his_avg_form", "sjl_his_avg_to", "");//设置字段值
        KyFromUtil.setItemDisabled("sjl_his_avg_form", "sjl_his_avg_from", true);//设置字段锁定
        KyFromUtil.setItemDisabled("sjl_his_avg_form", "sjl_his_avg_to", true);//设置字段锁定

      }
      if (value != "custom_range") {
        KyFromUtil.setItemValue("sjl_his_avg_form", "sjl_his_avg_from", "");//设置字段值
        KyFromUtil.setItemValue("sjl_his_avg_form", "sjl_his_avg_to", "");//设置字段值
        KyFromUtil.setItemDisabled("sjl_his_avg_form", "sjl_his_avg_from", true);//设置字段锁定
        KyFromUtil.setItemDisabled("sjl_his_avg_form", "sjl_his_avg_to", true);//设置字段锁定

        $("#sjl_his_avg_error").hide();
      } else {
        KyFromUtil.setItemDisabled("sjl_his_avg_form", "sjl_his_avg_from", false);//设置字段锁定
        KyFromUtil.setItemDisabled("sjl_his_avg_form", "sjl_his_avg_to", false);//设置字段锁定

      }
      $("[name='sjl_his_avg_range']").on("click", function () {//给元素绑定事件
        valu = KyFromUtil.getItemValue("sjl_his_avg_form", "sjl_his_avg_range");//获取字段值
        if (valu != "custom_range") {
          // KyFromUtil.removeItemRequired("syl_his_avg_form","tbab_custom_day_input");//删除字段必填
          KyFromUtil.setItemDisabled("sjl_his_avg_form", "sjl_his_avg_from", true);//设置字段锁定
          KyFromUtil.setItemDisabled("sjl_his_avg_form", "sjl_his_avg_to", true);//设置字段锁定
          KyFromUtil.setItemValue("sjl_his_avg_form", "sjl_his_avg_from", "");//设置字段值
          KyFromUtil.setItemValue("sjl_his_avg_form", "sjl_his_avg_to", "");//设置字段值
          $("#sjl_his_avg_error").hide();
        } else {
          KyFromUtil.setItemDisabled("sjl_his_avg_form", "sjl_his_avg_from", false);//解锁字段
          KyFromUtil.setItemDisabled("sjl_his_avg_form", "sjl_his_avg_to", false);//解锁字段
        }
      });
      setTimeout(function () {
        if(hiddenValueval.indexOf("year")<0){
          $("input[name='sjl_his_avg_range']:first").attr('checked', 'checked');
        }
      },300);
      $("#sjl_his_avg").modal("show");

    } else if ($(this).val() == "industry_asj_avg") {//-----------------------行业均值（市净率）
      var hiddenValueval = $("#selectValueInput_" + indexNo + "_hiddenval").val();
      $("#sjl_ins_avg_error").hide();
      //行业市净率均值
      $("#sjl_ins_avg").data("indexNo", indexNo);
      $("#sjl_ins_avg_form").resetForm();
      formId = "sjl_ins_avg_form";
      obj = specialValObj["IC1000300020_" + indexNo];
      $("#sjl_ins_avg_ins_select").bind("change", function () {
        if ($(this).val() == "") {
          $("#sjl_ins_avg_error").show();
        } else {
          $("#sjl_ins_avg_error").hide();
        }
      });
      setTimeout(function () {
        if(hiddenValueval.indexOf("1000")<0){
          $("#sjl_ins_avg_ins_select").parent().find("span:eq(0)").text("");
        }
      },300);
      $("#sjl_ins_avg").modal("show");
      /*  var num = $("#zhishucunfang").val();*/
      /*if(isNull(num)){
                $("#sjl_ins_avg_ins_select").select2("data",{id: "", text: ""});
                $("#sjl_ins_avg_error").hide();
                $('#sjl_ins_avg_error_text').text("");
                obj="";
            }*/
    } else if ($(this).val() == "debt_ratio") {
      var hiddenValueval = $("#selectValueInput_" + indexNo + "_hiddenval").val();
      //行业资产负债率
      $("#debt_ratio").data("indexNo", indexNo);
      $("#debt_ratio_form").resetForm();
      $("#debt_ratio_form").find('.select2-saya').val("");
      formId = "debt_ratio_form";
      obj = specialValObj["IC10002000100010_" + indexNo];
      setTimeout(function () {
        if(hiddenValueval.indexOf("1000")<0){
          $("#debt_ratio_select").parent().find("span:eq(0)").text("");
        }
      },300);
      $("#debt_ratio").modal("show");
      /*var zhai = $("#fuZhai").val();
            if(isNull(zhai)){
                $("#s2id_debt_ratio_select").select2("data",{id: "", text: ""});
                $("#sjl_ins_avg_error").hide();
                $('#debt_ratio_select_error').text("");
                obj="";
            }*/
    }

    //给所有带弹框的选项添加逻辑处理
    /*if(formId!=""){
            //给元素赋选之前的值
            $(this).select2("data",{id: previous_value.id, text: previous_value.text});
        }*/

    for (var i in obj) {
      if (i && obj[i]) {
        KyFromUtil.setItemValue(formId, i, obj[i]);
      }
    }
  });
}
//当指标为管理层打分的逻辑
function numericalOnClicks(indexNo,treeNode) {
  var beginValue= $("#beginValue_" + indexNo).val();
  var endValue=$("#endValue_"+indexNo).val();
  if(treeNode=="IC1200100010"){
    if(beginValue.trim()!="" && endValue.trim()!=""){
      if(new RegExp("[1-5]").test(beginValue) && new RegExp("[1-5]").test(endValue)){
        numericalOnClick(indexNo);
      }else{
        stamp=false;
        parent.kyTools.message({type: 'error', message: '请输入1-5的数值！！！'}, {closeInSeconds: 3});
      }
    }
  }
}
//通用的设置值的大小
function numericalOnClick(indexNo) {
  var beginValue= parseInt($("#beginValue_" + indexNo).val());
  var endValue=parseInt($("#endValue_"+indexNo).val());
  if(isNull(endValue)){
    if(beginValue<0){
      stamp=false;
      parent.kyTools.message({type: 'error', message: '数值不能小于0'}, {closeInSeconds: 3});
      return ;
    }
  }else if(isNull(beginValue)){
    if(endValue<0){
      stamp=false;
      parent.kyTools.message({type: 'error', message: '数值不能小于0'}, {closeInSeconds: 3});
      return ;
    }
  }else  if(endValue<beginValue){
    stamp=false;
    parent.kyTools.message({type: 'error', message: '起始值不能大于结束值'}, {closeInSeconds: 3});
    return ;
  }
  stamp = true ;

}

//左侧指标点击事件
function indexCategoryTreeOnClick(event, treeId, treeNode) {
  _indexCount++;
  var indexNo = _indexCount;
  indexNo_map_indexSerialNo[indexNo] = treeNode.id + "_" + indexNo;
  var indexData = getIndexConfigData(treeNode.id);
  var indexUnitOptions = "";
  //处理预测净利润单位，默认单位万元
  if(treeNode.id==="IC1000100010"){
    indexUnitOptions = getIndexUnitOptionsForNp(indexData);
  }else{
    indexUnitOptions = getIndexUnitOptions(indexData);
  }
  var indexValueOptions = getIndexValueOptions(indexData);
  var indexValueOptionsHtml = "";
  if (indexValueOptions) {
    //选择管理层打分就隐藏button(liur)
    if(treeNode.id=="IC1200100010"){
      indexValueOptionsHtml = "<td><div class=' input-group input-group-sm'><select style='width:150px;' name='selectValueInput_" + indexNo + "' id='selectValueInput_" + indexNo + "' class=' select2-allow-clear select2 input-sm select2-saya-" + indexNo + "'>" + indexValueOptions + "</select></div><div style='display:none;' class='form-group-sm' id='betweenValues_" + indexNo + "'><input type='number' oninput='clearNoNum(this);' onchange='numericalOnClicks("+indexNo+",\""+treeNode.id+"\")';  id='beginValue_" + indexNo + "' name='beginValue_" + indexNo + "' class=''><span  style='vertical-align: middle;'>至</span><input type='number' oninput='clearNoNum(this);' onchange='numericalOnClicks("+indexNo+",\""+treeNode.id+"\")';  id='endValue_" + indexNo + "' name='endValue_" + indexNo + "' class=''></div></td>";
    }else{
      indexValueOptionsHtml = "<td><div class=' input-group input-group-sm'><select style='width:150px;' name='selectValueInput_" + indexNo + "' id='selectValueInput_" + indexNo + "' class=' select2-allow-clear select2 input-sm select2-saya-" + indexNo + "'>" + indexValueOptions + "</select><span class=''><button id='selectValueButton_" + indexNo + "' class='btn blue btn-sm' type='button'><i class='fa fa-exchange'></i></button></span></div><div style='display:none;' class='form-group-sm' id='betweenValues_" + indexNo + "'><input type='number' oninput='clearNoNum(this);' onchange='numericalOnClick(\""+indexNo+"\")';  id='beginValue_" + indexNo + "' name='beginValue_" + indexNo + "' class=''><span  style='vertical-align: middle;'>至</span><input type='number' oninput='clearNoNum(this);' onchange='numericalOnClick(\""+indexNo+"\")';   id='endValue_" + indexNo + "' name='endValue_" + indexNo + "' class=''></div></td>";
    }
  } else {
    indexValueOptionsHtml = "<td><div class=' input-group input-group-sm'><input name='selectValueInput_" + indexNo + "' id='selectValueInput_" + indexNo + "' class='' oninput='clearNoNum(this);' type='number' /></div><div style='display:none;' class='form-group-sm' id='betweenValues_" + indexNo + "'><input type='number' oninput='clearNoNum(this);' onchange='numericalOnClick(\""+indexNo+"\")';  id='beginValue_" + indexNo + "' name='beginValue_" + indexNo + "' class=''><span  style='vertical-align: middle;'>至</span><input type='number' oninput='clearNoNum(this);' onchange='numericalOnClick(\""+indexNo+"\")';  id='endValue_" + indexNo + "' name='endValue_" + indexNo + "' class=''></div></td>";
  }
  var operateOption = "<td> <div class='form-group-sm'><select id='operatorSelect_" + indexNo + "' name='operatorSelect_" + indexNo + "' class='form-control form-control-new select2-allow-clear select2 input-sm select2-saya-" + indexNo + "'><option value=''>--请选择--</option><option value='EQ'>等于</option><option value='LT'>小于</option><option value='GT'>大于</option><option value='LTE'>小于等于</option><option value='GTE'>大于等于</option><option value='BT'>介于区间</option> <option value='NO'>无操作符</option></select></div></td>" + indexValueOptionsHtml;
  if (treeNode.id == "IC1000300010" || treeNode.id == "IC1000400010" || treeNode.id == "IC10002000300070") {
    //市盈率PE（TTM） 沪深300成分权重 营业收入
    operateOption = "<td> <div class='form-group-sm'><select id='operatorSelect_" + indexNo + "' name='operatorSelect_" + indexNo + "' class='form-control form-control-new select2-allow-clear select2 input-sm select2-saya-" + indexNo + "'><option value='alls'>--请选择--</option><option value='EQ'>等于</option><option value='LT'>小于</option><option value='GT'>大于</option><option value='LTE'>小于等于</option><option value='GTE'>大于等于</option><option value='BT'>介于区间</option> <option value='NO'>无操作符</option><option value='CUSTOM_OPT'>自定义（取对应行业内排名前N名）</option></select></div></td>" + indexValueOptionsHtml;
  }
  //生成右侧list列表
  var trHtml = "<tr><td id='" + treeNode.tId + "'><div class='input-group input-group-sm'><input name='serialNo_" + indexNo + "' id='serialNo_" + indexNo + "' class='form-control form-control-new' type='text' readonly value='" + indexNo + "' style='width:20px;' /></div></td>" +
    "<td hidden><div class='input-group input-group-sm'><input name='indexNo_" + indexNo + "' readonly id='indexNo_" + indexNo + "' class='form-control form-control-new' type='text' value='" + treeNode.id + "_" + indexNo + "' /></div></td>" +
    "<td>" + treeNode.name + "</td>" +
    "<td hidden><input type='text' id='indexFullName_" + indexNo + "' name='indexFullName_" + indexNo + "' value='" + treeNode.name + "'/></td>" +
    "<td><div class='input-group input-group-sm' ><input type='text' id='setParamInput_" + indexNo + "' name='setParamInput_" + indexNo + "' readonly class='form-control form-control-new input-sm'/><span class='input-group-btn'><button class='btn btn-sm blue' id='setParamBtn_" + indexNo + "' type='button'>设置</button></span></div></td>" +
    "<td hidden><input type='text' id='setParamInputHidden_" + indexNo + "' name='setParamInputHidden_" + indexNo + "'/></td>" +
    "<td hidden><input type='text' id='specialVal_" + indexNo + "' name='specialVal_" + indexNo + "'/></td>" +
    operateOption +
    "<td><input id='selectValueInput_"+indexNo+"_hiddentext' type='hidden'>  <input id='selectValueInput_"+indexNo+"_hiddenval' type='hidden'> <input id='selectValueInput_"+indexNo+"_hiddenvals' type='hidden'> <div class='form-group-sm'><select id='selectIndexUnit_" + indexNo + "' name='selectIndexUnit_" + indexNo + "' class='form-control form-control-new select2-allow-clear select2 input-sm select2-saya-" + indexNo + "'>" + indexUnitOptions + "</select></div></td>" +
    "<td><button class='btn btn-sm blue' id='delBtn_" + indexNo + "' type='button'>删除</button></td></tr>";
  $("#tbodyId").append(trHtml);
  $(".select2-saya-" + indexNo).select2({
    allowClear: true
  });

  // 设置参数按钮事件
  $("#setParamBtn_" + indexNo).on("click", function () {
    $('#error_message_IC1000600010').text("");
    $('#error_message_IC1000600030_form').text("");
    $('#error_message_IC1000600040_form').text("");
    var a = $("#cs").val();

    if (indexData.indexParmaId) {
      $("#" + treeNode.id + "_form").resetForm();
      $("#" + treeNode.id + "_form").find(".select2-allow-clear").val("").trigger("change");
      var title = $("#" + treeNode.id).find(".modal-title").html();
      if (title.indexOf("(") > -1) {
        title = title.substring(0, title.indexOf("("));
        $("#" + treeNode.id).find(".modal-title").html(title);
      }
      if (indexParamObj[treeNode.id + "_" + indexNo]) {
        for (var i in indexParamObj[treeNode.id + "_" + indexNo]) {
          KyFromUtil.setItemValue(treeNode.id + "_form", i, indexParamObj[treeNode.id + "_" + indexNo][i], false);
        }
        $("#" + treeNode.id).find(".modal-title").html(title + "" + $("#setParamInput_" + indexNo).val() + "");

      }
      setFromValidate(indexData.indexParmaId);
      $("#" + indexData.indexParmaId).data("indexNo", indexNo);
      $("#" + indexData.indexParmaId).modal("show");
    }
    if(isNull(a)){
      $("#s2id_tboa_industry_select").select2("data",{id:"",text:""});
    }
  });
  bindExchangeFunction(indexNo);
  //指标运算符下拉值改变事件
  $("#operatorSelect_" + indexNo).on('change', function () {
    $("#IC1000400010_OPT_error").hide();
    var hu = $("#huShen").val();
    if(isNull(hu)){
      $("#s2id_hs300_custom_ins_select").select2("data",{id: "", text: ""});
      KyFromUtil.setItemValue("IC1000400010_OPT_FORM","SORT_VALUE_45"," ");
    }
    var whereValue = $("#condition_expression").val();
    var expression = whereValue.replace(/\s+/g, " ");
    var expressionArray = expression.split(" ");
    if (expressionArray.indexOf("#" + indexNo) < 0) {
      if (isNull(whereValue)) {
        $("#condition_expression").val(whereValue + " #" + indexNo);
      } else {
        $("#condition_expression").val(whereValue + " AND #" + indexNo);
      }
    }
  });

  // 运算符选择事件
  $("#operatorSelect_" + indexNo).on('select2-close', function () {
    $("div[id$='_OPT']").unbind("hidden.bs.modal");
    $("div[id$='_OPT']").on('hidden.bs.modal', function () {
      var value = KyFromUtil.getItemValue("indexsTable", "specialVal_" + indexNo);
      if (isNull(value)) {
        KyFromUtil.setItemValue("indexsTable", "operatorSelect_" + indexNo, "");
      }
    });
    //指标为，市盈率pe、营业收入、沪深300成分权重
    if($(this).val()!= "CUSTOM_OPT"){
      if(treeNode.id == "IC1000300010"){
        specialValObj["IC1000300010_" + indexNo]="";
        $("#shi").val("");
        $("#SORT_TYPE_44_hidden").val("");
        $("#SORT_VALUE_44_hidden").val("");
      }else if(treeNode.id == "IC1000400010"){
        specialValObj["IC1000400010_" + indexNo]="";
        $("#hs300_custom_ins_select").select2("val",["MC1000400010"]);
        $("#SORT_TYPE_45_hidden").val("");
        $("#SORT_VALUE_45_hidden").val("");
      }else if(treeNode.id == "IC10002000300070"){
        specialValObj["IC10002000300070_" + indexNo]="";
        $("#SORT_OPTION_1122").select2("val",["MC1000400010"]);
        $("#SORT_OPTION_1122_hidden").val("");
        $("#SORT_VALUE_1122_hidden").val("");
      }
    }

    var formId = "indexsTable";
    if ($(this).val() == "CUSTOM_OPT") {
      var shi = $("#shi").val();
      if(isNull(shi)){
        $("#s2id_syl_custom_ins_select").select2("data",{id:"",text:""});
      }
      var obj = {}, formid = "";
      if (treeNode.id == "IC1000300010") {
        $("#IC1000300010_OPT").data("indexNo", indexNo);
        //$("#IC1000300010_OPT_title_text").text("对应的子行业分类:中信一级子行业");
        //清除提示002
        $("#IC1000300010_OPT_FORM_error").hide();
        if (isNull(strategyUpdateId)) $("#IC1000300010_OPT").modal("show");
        $("#IC1000300010_OPT_FORM").resetForm();
        $("#IC1000300010_OPT_FORM").find('.select2-saya').val("");
        formId = "IC1000300010_OPT_FORM";
        obj = specialValObj["IC1000300010_" + indexNo];

        //默认按钮
        var value = KyFromUtil.getItemValue("IC1000300010_OPT_FORM", "SORT_TYPE_44");//获取字段值
        if (isNull(value)) {
          KyFromUtil.setItemValue("IC1000300010_OPT_FORM", "SORT_TYPE_44", "HIGH_TO_LOW");
        }

      } else if (treeNode.id == "IC1000400010") {
        $("#IC1000400010_OPT").data("indexNo", indexNo);
        //$("#IC1000400010_OPT_title_text").text("对应的子行业分类:中信一级子行业");
        if (isNull(strategyUpdateId)) $("#IC1000400010_OPT").modal("show");
        $("#IC1000400010_OPT_FORM").resetForm();
        $("#IC1000400010_OPT_FORM").find('.select2-saya').val("");
        formId = "IC1000400010_OPT_FORM";
        obj = specialValObj["IC1000400010_" + indexNo];

        //默认按钮
        var value = KyFromUtil.getItemValue("IC1000400010_OPT_FORM", "SORT_TYPE_45");//获取字段值
        if (isNull(value)) {
          KyFromUtil.setItemValue("IC1000400010_OPT_FORM", "SORT_TYPE_45", "HIGH_TO_LOW");
        }
      } else if (treeNode.id == "IC10002000300070") {
        //营业收入
        $("#IC10002000300070_OPT").data("indexNo", indexNo);
        $("#IC10002000300070_OPT_title_text").text("行业排名");
        if (isNull(strategyUpdateId)) $("#IC10002000300070_OPT").modal("show");
        $("#IC10002000300070_OPT_FORM").resetForm();
        $("#IC10002000300070_OPT_FORM").find('.select2-saya').val("");
        formId = "IC10002000300070_OPT_FORM";
        obj = specialValObj["IC10002000300070_" + indexNo];
        var yysr=$("#yysr").val();
        var yysr2=$("#yysr2").val();
        if(isNull(yysr)){
          $("#s2id_SORT_OPTION_1122").select2("data",{id:"",text:""});
          $('#IC10002000300070_OPT_error_text').text("");
          obj = "";
        }
        if(isNull(yysr2)){
          $("#SORT_VALUE_1122").val("");
          $('#IC10002000300070_OPT_error_text').text("");
          obj = "";
        }
        //默认按钮
        // var value =KyFromUtil.getItemValue("IC10002000300070_OPT_FORM","SORT_OPTION_1122");//获取字段值
        // if(isNull(value)){
        //     KyFromUtil.setItemValue("IC10002000300070_OPT_FORM","SORT_OPTION_1122","MC1000400010");
        // }
      }
      //当自定义有选项为空时下拉框回到默认选项
      for (var i in obj) {
        if (i && obj[i]) {
          KyFromUtil.setItemValue(formId, i, obj[i]);
        }
      }
      var shi = $("#shi").val();
      if(isNull(shi)){
        $("#s2id_syl_custom_ins_select").select2("data",{id:" ",text:" "});
        KyFromUtil.setItemValue("IC1000300010_OPT_FORM","SORT_VALUE_44"," ");
      }
    }
    if ($(this).val() == "BT") {
      $("#selectValueInput_" + indexNo).parent().css("display", "none");
      $("#betweenValues_" + indexNo).css("display", "block");
      $("#beginValue_" + indexNo).attr("maxlength", "15");
      $("#endValue_" + indexNo).attr("maxlength", "15");
      $("#selectValueInput_" + indexNo).attr("maxlength", "30");
      $("#beginValue_" + indexNo).val("");
      $("#endValue_" + indexNo).val("");
    } else {
      $("#selectValueInput_" + indexNo).parent().css("display", "block");
      $("#betweenValues_" + indexNo).css("display", "none");
      $("#selectValueInput_" + indexNo).attr("maxlength", "30");
    }
    if ($(this).val() == "NO" || $(this).val() == "CUSTOM_OPT") {//选择无操作符禁用数值与单位
      $("#selectValueInput_" + indexNo).attr("disabled", "disabled");
      $("#selectIndexUnit_" + indexNo).attr("disabled", "disabled");
      //禁用时将数值与单位恢复默认值
      KyFromUtil.setItemValue(formId, "selectIndexUnit_" + indexNo, "");//设置参数值
      KyFromUtil.setItemValue(formId, "selectValueInput_" + indexNo, "");//设置参数值
      /*$("#selectValueInput_"+indexNo).hide();
						$("#selectIndexUnit_"+indexNo).parent().hide();*/
      //对于数值   如果是输入框   则直接隐藏该元素  如果是下拉 则是影藏父元素
      //alert($("#selectValueInput_"+indexNo).attr("type"));
      if ($("#selectValueInput_" + indexNo).attr("type") == "text") {
        $("#selectValueInput_" + indexNo).css("visibility", "hidden");
      } else {
        $("#selectValueInput_" + indexNo).parent().css("visibility", "hidden");
      }
      $("#selectIndexUnit_" + indexNo).parent().css("visibility", "hidden");
      //selectValueButton_2
      $("#selectValueButton_" + indexNo).parent().css("visibility", "hidden");
      //去除验证
      //KyFromUtil.removeItemRequired(form,"tbaa_custom_day_input");//删除字段必填
    } else {
      $("#selectValueInput_" + indexNo).removeAttr("disabled");
      $("#selectIndexUnit_" + indexNo).removeAttr("disabled");
      if ($("#selectValueInput_" + indexNo).attr("type") == "text") {
        $("#selectValueInput_" + indexNo).css("visibility", "visible");
      } else {
        $("#selectValueInput_" + indexNo).parent().css("visibility", "visible");
      }
      $("#selectIndexUnit_" + indexNo).parent().css("visibility", "visible");
      $("#selectValueButton_" + indexNo).parent().css("visibility", "visible");
      //打开验证
      //KyFromUtil.setItemRequired(form,"tbaa_custom_day_input");//删除字段必填
    }
  });

  // 设置数值选项按钮事件（是否切换自定义输入）
  $("#selectValueButton_" + indexNo).on("click", function () {
    var formId = "indexsTable";
    if ($("#selectValueInput_" + indexNo).prop("tagName") == "SELECT") {
      $("#selectValueInput_" + indexNo).remove();
      $("#s2id_selectValueInput_" + indexNo).remove();
      $("#selectValueButton_" + indexNo).parent().before("<input id='selectValueInput_" + indexNo + "' name='selectValueInput_" + indexNo + "' class='' oninput='clearNoNum(this);' type='number' maxlength='30'  />");
      if ($("#operatorSelect_" + indexNo).val() == "NO") {
        $("#selectValueInput_" + indexNo).attr("disabled", "disabled");

      } else {
        $("#selectValueInput_" + indexNo).removeAttr("disabled");

      }
      //KyFromUtil.setItemNumber(formId,"selectValueInput_"+indexNo,"数值：");
    } else if ($("#selectValueInput_" + indexNo).prop("tagName") == "INPUT") {
      $("#selectValueInput_" + indexNo).remove();
      $("#selectValueButton_" + indexNo).parent().before("<select style='width:150px;' id='selectValueInput_" + indexNo + "' name='selectValueInput_" + indexNo + "' class=' select2-allow-clear select2 input-sm'>" + indexValueOptions + "</select>");
      if ($("#operatorSelect_" + indexNo).val() == "NO") {
        $("#selectValueInput_" + indexNo).attr("disabled", "disabled");
      } else {
        $("#selectValueInput_" + indexNo).removeAttr("disabled");
      }
      $("#selectValueInput_" + indexNo).select2({

        allowClear: true
      });
      //KyFromUtil.removeItemNumber(formId,"selectValueInput_"+indexNo);
      bindExchangeFunction(indexNo);

    }
  });
  $("#operatorSelect_" + indexNo).trigger("select2-close");
  // 删除指标按钮事件
  $("#delBtn_" + indexNo).on("click", function () {
    var expression = $("#condition_expression").val().replace(/\s+/g, " ");
    var expressionArray = expression.split(" ");
    if (expressionArray.indexOf("#" + indexNo) > 0) {
      if (!confirm("该指标出现在条件表达式,删除后可能导致表达式错误,确定删除吗")) {
        return;
      }
    }
    if (_indexCount == indexNo) {
      _indexCount--;
    }
    if (indexParamObj[indexNo_map_indexSerialNo[indexNo]]) {
      delete indexParamObj[indexNo_map_indexSerialNo[indexNo]];
      delete specialValObj[indexNo_map_indexSerialNo[indexNo]];
      delete indexNo_map_indexSerialNo[indexNo];
    }
    /* $("#zhishucunfang").val("");*/
    /* $("#fuZhai").val("");*/
    $("#huShen").val("");
    $("#shi").val("");
    /* $("#sylpb").val("");*/
    $("#yysr").val("");
    $("#yysr2").val("");
    $("#SORT_VALUE_1122").val("");
    $("#cs").val("");
    $("#s2id_tboa_industry_select").select2("data",{id:"",text:""});
    $("#s2id_SORT_OPTION_1122").select2("data",{id:"",text:""});
    $("#syl_ins_avg_ins_select").select2("data",{id: "", text: ""});
    $("#s2id_syl_custom_ins_select").select2("data",{id: "", text: ""});
    $("#sjl_ins_avg_ins_select").select2("data",{id: "", text: ""});
    $("#s2id_debt_ratio_select").select2("data",{id: "", text: ""});
    $("#s2id_hs300_custom_ins_select").select2("data",{id: "", text: ""});

    $(this).parent().parent().remove();
  });
  setRunValidate(indexData.indexParmaId, indexNo);
}

//指标点击前事件
function indexCategoryTreeBeforeClick(treeId, treeNode, clickFlag) {

  //禁用父节点点击
  if (treeNode.isParent) return false;
  if ($("#currentSelectRange").val() == "") {
    parent.kyTools.message({type: 'error', message: '请先选择选股范围'}, {closeInSeconds: 3});
    return false;
  } else {
    return true;
  }
}

//指标单位获取函数
function getIndexConfigData(indexNo) {
  var indexData = {};
  $.ajax({
    url: _basePath + "/app/sharePolicy/page/index/" + indexNo,
    async: false,
    cache: false,
    dataType: "json",
    success: function (data) {
      indexData = data;
    }
  });
  return indexData;
}

//获取行业分类树图
function getIndustryZtreeData(industryDegree) {
  var industryZtreeData = {};
  $.ajax({
    url: _basePath + "/app/sharePolicy/page/ztree/industry/" + industryDegree,
    async: false,
    cache: false,
    dataType: "json",
    success: function (data) {
      industryZtreeData = data;
    }
  });
  return industryZtreeData;
}

//获取板块树图
function getBoardZtreeData() {
  var boardZtreeData = {};
  $.ajax({
    url: _basePath + "/app/sharePolicy/page/ztree/board/getBoardTreeDate",
    async: false,
    cache: false,
    dataType: "json",
    success: function (data) {
      boardZtreeData = data;
    }
  });
  return boardZtreeData;

}

//获取指标单位选项
function getIndexUnitOptions(indexData) {
  var indexUnitArray = [];
  var options = "";
  if (indexData.indexUnit) {
    indexUnitArray = indexData.indexUnit.split(",");
    if (indexUnitArray.length > 0) {
      for (var i = 0, len = indexUnitArray.length; i < len; i++) {
        var tmp = indexUnitArray[i].split("@");
        options += "<option value='" + tmp[0] + "'>" + tmp[1] + "</option>";
      }

    }
  }
  return options;
}

//单独处理预测净利润单位
function getIndexUnitOptionsForNp(indexData) {
  var indexUnitArray = [];
  var options = [];
  var optionsTemp = "";
  if (indexData.indexUnit) {
    indexUnitArray = indexData.indexUnit.split(",");
    if (indexUnitArray.length > 0) {
      for (var i = 0, len = indexUnitArray.length; i < len; i++) {
        var tmp = indexUnitArray[i].split("@");
        if(tmp[0]!="WYUAN"){
          options.push("<option value='" + tmp[0] + "'>" + tmp[1] + "</option>");
        }else{
          optionsTemp = "<option value='" + tmp[0] + "'>" + tmp[1] + "</option>";
        }
      }

    }
  }
  options.unshift(optionsTemp);
  return options.join("");
}

//获取值选项
function getIndexValueOptions(indexData) {
  var indexValueArray = [];
  var options = "<option value=''>--请选择--</option>";
  if (indexData.indexOption) {
    indexValueArray = indexData.indexOption.split(",");
    if (indexValueArray.length > 0) {
      for (var i = 0, len = indexValueArray.length; i < len; i++) {
        var tmp = indexValueArray[i].split("@");
        options += "<option value='" + tmp[0] + "'>" + tmp[1] + "</option>";
      }
    }
  } else {
    options = "";
  }
  return options;
}

//生成策略ID的方法
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid.toUpperCase();
}

//查询上一年年报是否已出
function queryAnnualReportPublished(date) {
  var sReturn = false;
  $.ajax({
    url: _basePath + "/app/sharePolicy/page/annualReport/" + date,
    async: false,
    cache: false,
    dataType: "text",
    success: function (data) {
      if (data == "true") {
        sReturn = true;
      }
    }
  });
  return sReturn;
}

//日期减法函数
function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
  if (dd.getDay() == 6) {
    dd.setDate(dd.getDate() - 1);
  } else if (dd.getDay() == 0) {
    dd.setDate(dd.getDate() - 2);
  }
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期
  var d = dd.getDate();
  if (m < 10) {
    m = "0" + m;
  }
  if (d < 10) {
    d = "0" + d;
  }
  return y + "-" + m + "-" + d;
}

//获取最近工作日
function getLatestClosingDay(date) {
  var sReturn = "";
  $.ajax({
    url: _basePath + "/app/sharePolicy/page/calcDate/getLatestClosingDay/" + date,
    async: false,
    cache: false,
    dataType: "text",
    success: function (data) {
      sReturn = data;
    }
  });
  return sReturn;
}

//获取日期减法
function calcDate(date, addDayCount) {
  date = date.replace(new RegExp(/-/gm), "/");
  var dd = new Date(date);
  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期
  var d = dd.getDate();
  if (m < 10) {
    m = "0" + m;
  }
  if (d < 10) {
    d = "0" + d;
  }
  return y + "-" + m + "-" + d;
}

//获取当前日期的字符串
function getCurrentDay() {
  var dd = new Date();
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期
  var d = dd.getDate();
  if (m < 10) {
    m = "0" + m;
  }
  if (d < 10) {
    d = "0" + d;
  }
  return y + "-" + m + "-" + d;
}

//创建选股结果页面table
function createStrategyResultTable(id, strategyId, isFlag) {
  //zhuhao 20190507 添加一行代码
  StrategyTable.otherOptions = {
    scrollY:"250px",
    scrollX:true,
    scrollCollapse:false,
    "dom":"tr<'row'<'col-sm-7' li><'col-sm-5'p>>"};
  // StrategyTable.datatableCallback = function(){
  //     setTimeout(function () {
  //         $("#stockResults th").css("width","100%");
  //     },200);
  // };
  strategyList = StrategyTable.createList(strategyId, id, "", "0020","");
}

//校验表达式函数
function checkExpressionGrammar(expression) {
  var sReturn = true;
  if (expression == null || expression.trim() == "") {
    sReturn = false;
    errorObj = {"表达式": ["不能为空"]};
    return sReturn;
  }
  if (expression.match(/\d+\s+\d/ig)) {
    sReturn = false;
    errorObj = {"表达式": ["语法有误"]};
    return sReturn;
  }

  var tmpWhere1 = expression.replace(/#/ig, "").replace(/\s+/g, "").replace(/AND/ig, '&').replace(/OR/ig, '|').trim();
  tmpWhere1 = '1+(' + tmpWhere1 + ')';
  try {
    eval(tmpWhere1);
  } catch (err) {
    sReturn = false;
    errorObj = {"表达式": ["语法有误"]};
    return sReturn;
  }
  var tmpWhere = expression.replace(/#/ig, "").replace(/\s+/g, "").replace(/\(/g, "").replace(/\)/g, "").trim();

  expression = expression.replace(/\(/g, " ").replace(/\)/g, " ").replace(/AND/ig, " ").replace(/OR/ig, " ").replace(/>/ig, " ").replace(/=/ig, " ").replace(/</ig, " ").replace(/#/ig, " ").trim();
  if (expression.replace(/([0-9]+\s+)+[0-9]+|[0-9]+/g, '△') != '△') {
    sReturn = false;
    errorObj = {"表达式": ["含有非法或无效字符"]};
    return sReturn;
  }
  if (!tmpWhere.match(/^(\d+((AND|OR)|(=|>|<|>=|<=)))*\d+$/ig)) {
    sReturn = false;
    errorObj = {"表达式": ["语法有误"]};
    return sReturn;
  } else {
    tmpWhere = tmpWhere.replace(/(>=|<=)/g, "△").replace(/(>|<|=)/g, "△").replace(/\d/g, "");
    if (tmpWhere.match(/△{2,}/)) {
      sReturn = false;
      errorObj = {"表达式": ["不能出现连续的大小比较，请拆分"]};
      return sReturn;
    }
  }
}

//判断条件表达式的函数
function checkExpression(expression) {
  var sReturn = true;//表达式是否正确
  var tmpArray = [];
  var tmpWhere = "";
  var tmpWhere1 = "";
  var expressionReg = "";
  if (expression == null || expression.trim() == "") {
    sReturn = false;
    errorObj = {"表达式": ["不能为空"]};
    return sReturn;
  }
  $("input[name^='serialNo_']").each(function (i, v) {
    tmpArray.push($(this).val());
  });
  if (expression.match(/\d+\s+\d/ig)) {
    sReturn = false;
    errorObj = {"表达式": ["语法有误"]};
    return sReturn;
  }
  //判断做括号数是否与右括号数相同
  if (expression.match(/\(/ig) && expression.match(/\)/ig)) {
    if (expression.match(/\(/ig).length - expression.match(/\)/ig).length > 0) {
      sReturn = false;
      errorObj = {"表达式": ["缺失右括号"]};
      return sReturn;
    } else if (expression.match(/\(/ig).length - expression.match(/\)/ig).length < 0) {
      sReturn = false;
      errorObj = {"表达式": ["缺失左括号"]};

      return sReturn;
    }
  } else if (expression.match(/\(/ig) || expression.match(/\)/ig)) {
    if (expression.match(/\(/ig)) {
      sReturn = false;
      errorObj = {"表达式": ["缺失右括号"]};
      return sReturn;
    } else {
      sReturn = false;
      errorObj = {"表达式": ["缺失左括号"]};
      return sReturn;
    }
  }
  tmpWhere1 = expression.replace(/#/ig, "").replace(/\s+/g, "").replace(/AND/ig, '&').replace(/OR/ig, '|').trim();
  tmpWhere1 = '1+(' + tmpWhere1 + ')';
  try {
    eval(tmpWhere1);
  } catch (err) {
    sReturn = false;
    errorObj = {"表达式": ["语法有误"]};
    return sReturn;
  }
  tmpWhere = expression.replace(/#/ig, "").replace(/\s+/g, "").replace(/\(/g, "").replace(/\)/g, "").trim();

  expression = expression.replace(/\(/g, " ").replace(/\)/g, " ").replace(/AND/ig, " ").replace(/OR/ig, " ").replace(/>/ig, " ").replace(/=/ig, " ").replace(/</ig, " ").replace(/#/ig, " ").trim();
  if (expression.replace(/([0-9]+\s+)+[0-9]+|[0-9]+/g, '△') != '△') {
    sReturn = false;
    errorObj = {"表达式": ["含有非法或无效字符"]};
    return sReturn;
  }
  if (!tmpWhere.match(/^(\d+((AND|OR)|(=|>|<|>=|<=)))*\d+$/ig)) {
    sReturn = false;
    errorObj = {"表达式": ["语法有误"]};
    return sReturn;
  } else {
    tmpWhere = tmpWhere.replace(/(>=|<=)/g, "△").replace(/(>|<|=)/g, "△").replace(/\d/g, "");
    if (tmpWhere.match(/△{2,}/)) {
      sReturn = false;
      errorObj = {"表达式": ["不能出现连续的大小比较，请拆分"]};
      return sReturn;
    }
  }
  expression = expression.replace(/\s+/g, " ");
  var expressionArray = expression.split(" ");
  expressionArray = expressionArray.filter(function (element, index, self) {
    return self.indexOf(element) === index;
  });

  function compare(val1, val2) {
    return parseInt(val1.trim()) - parseInt(val2.trim());
  }
  expressionArray.sort(compare);
  tmpArray.sort(compare);
  var arr2 = expressionArray.filter(function (el) {
    return !~tmpArray.indexOf(el);
  });
  if (arr2.length > 0) {
    sReturn = false;
    errorObj = {"表达式": ["序号为" + arr2.join() + "的指标不存在"]};
    return sReturn;
  }
  return sReturn;

}


/********************************************suwei 策略修改部分*************************************************************/
function strategyUpdatInit() {
  initRunForm();
  //获取策略修改需要回显的数据
  $.ajax({
    url: base + "/app/sharePolicy/page/strategy/edit/getStrategyEditData",
    data: {
      "strategyId": strategyUpdateId,
    },
    async: false,
    cache: false,
    dataType: "json",
    success: function (data) {
      //锁定选股口径
      var sValue = data["strategy"]["vcStockCaliber"];
      var rang = "";
      if (isNull(sValue)) return;
      $("input[value='" + sValue + "']").click();
      $("#select_Table .select2-chosen").text(data["strategy"]["vcStrategyName"]);
      selectedStrategyModelId = data["strategy"]["vcSerialno"];
      /*var arr = document.getElementsByName("radio_index");
						for (var i = 0; i < arr.length; i++){
								arr[i].setAttribute("disabled","disabled");
						}*/
      switch (data["strategy"]["vcStockRange"].split("@")[0]){
        case "sw_degree_01":
          rang = "(申万一级子行业)";
          break;
        case "sw_degree_02":
          rang = "(申万二级子行业)";
          break;
        case "sw_degree_03":
          rang = "(申万三级子行业)";
          break;
        case "citic_degree_01":
          rang = "(中信一级子行业)";
          break;
        case "citic_degree_02":
          rang = "(中信二级子行业)";
          break;
        case "citic_degree_03":
          rang = "(中信三级子行业)";
          break;
        case "csrc_degree_01":
          rang = "(证监会一级子行业)";
          break;
        case "csrc_degree_02":
          rang = "(证监会二级子行业)";
          break;
        case "csrc_degree_03":
          rang = "(证监会三级子行业)";
          break;
      }
      var stockName=data["strategy"]["vcStockRangeName"];
      var reg=/,$/gi;
      stockName=stockName.replace(reg,"");
      boardTreeObj.checkAllNodes(false);
      $("#currentSelectRange").val(rang+stockName);//设置选股范围名称
      $("#stock_range").val(data["strategy"]["vcStockRange"]);//设置选股范围ID
      if (data["strategy"]["vcStockRange"].split("@")[1] == "MC1000600010") {
        $("#indexCategoryTree").empty();
        $("#tbodyId").empty();
        $("#stockResults").empty();
        $("#condition_expression").val("");
        indexCategoryTreeObj = new GenerateZtree("IndexCategory", indexCategoryTreeSettings, "indexCategoryTree", {
          isFilter: "true",
          isHKStock: true
        }).init();
      }else{//选择非港股策略时，需切换到非港股指标树
        $("#indexCategoryTree").empty();
        $("#tbodyId").empty();
        $("#stockResults").empty();
        $("#condition_expression").val("");
        indexCategoryTreeObj = new GenerateZtree("IndexCategory", indexCategoryTreeSettings, "indexCategoryTree", {
          isFilter: "true",
          isHKStock: false
        }).init();
      }
      if (sValue == "radio_index_compare") {//比较选股
        setIndexCompareValue(data);
      } else {//排序选股
        setIndexSortValue(data);
      }
    }
  })
}

/**
 * 指标比较选股
 */
function setIndexCompareValue(data) {
  /**************************回显指标**************************************/
  var strategyData = data["strategy"];
  selectedStrategyModelId = data["strategy"]["vcSerialno"];
  strategyUpdateId = data["strategy"]["vcSerialno"];
  var indexData = data["strategyIndex"];
  indexParamObj = data["indexParameter"];
  for (var i = 0; i < indexData.length; i++) {
    var indexNo = indexData[i]["tisSerialno"].split("_")[0]; //指标id
    var serialnoNumber = indexData[i]["serialNoNbumber"];//指标序号
    var indexParam = indexData[i]["vcTsiParam"].split("△");//指标参数回显值
    var indexYsf = indexData[i]["vcTsiYsf"];//指标运算符
    var indexNumber = indexData[i]["vcTsiNumber"];//指标数值
    var indexUnit = indexData[i]["vcTsiCompany"];//指标单位
    _indexCount = serialnoNumber - 1;
    var node = indexCategoryTreeObj.getNodeByParam("id", indexNo);//获取树图节点对象
    indexCategoryTreeSettings.callback.onClick(null, indexCategoryTreeObj.setting.treeId, node);
    var formId = "indexsTable";
    KyFromUtil.setItemValue(formId, "setParamInput_" + serialnoNumber, indexParam[0]);//设置参数回显值
    KyFromUtil.setItemValue(formId, "setParamInputHidden_" + serialnoNumber, indexParam[1]);//设置参数回显值
    KyFromUtil.setItemValue(formId, "operatorSelect_" + serialnoNumber, indexYsf);//设置运算符下拉值
    if (indexYsf == "BT") {//运算符是介于区间时
      $("#operatorSelect_" + serialnoNumber).trigger('select2-close');
      var numberValue = indexNumber.split("△");
      KyFromUtil.setItemValue(formId, "beginValue_" + serialnoNumber, numberValue[0]);//设置数值开始值
      KyFromUtil.setItemValue(formId, "endValue_" + serialnoNumber, numberValue[1]);//设置数值结束值
    } else if (indexYsf == "NO") { //无操作符
      $("#operatorSelect_" + serialnoNumber).trigger('select2-close');
    } else if (indexYsf == "CUSTOM_OPT") {  //自定义
      $("#operatorSelect_" + serialnoNumber).trigger('select2-close');
      if (indexNo == "IC1000300010") {//市盈率PE（TTM）
        var specialValue = indexParamObj[indexNo + "_" + serialnoNumber]["tbfa_custom_rank"];

        var specialValues = specialValue.split("@");
        specialValObj[indexNo + "_" + serialnoNumber] = {
          "SORT_TYPE_44": specialValues[0],
          "SORT_VALUE_44": specialValues[1],
          "syl_custom_ins_select": specialValues[2]
        };
        KyFromUtil.setItemValue(formId, "specialVal_" + serialnoNumber, "tbfa_custom_rank□" + specialValue);

        //dong改,select_ 取值：由高到低（仅限于正直）val
        var select_ = $("#SORT_TYPE_44 option:selected").text();
        var ysfHuiXian = select_ + " 前";
        if (specialValues[1] == null || specialValues[1] == '') {
          ysfHuiXian = select_;
        } else {
          ysfHuiXian = select_ + " 前" + specialValues[1] + "名"
        }
        $("#operatorSelect_" + serialnoNumber).parent().find("div > a > span").eq(0)
          .text(ysfHuiXian);
        //dong改,select_ 取值：由高到低（仅限于正直）val

      } else if (indexNo == "IC1000400010") {//沪深300成分权重
        var specialValue = indexParamObj[indexNo + "_" + serialnoNumber]["tbga_custom_rank"];
        var specialValues = specialValue.split("@");
        specialValObj[indexNo + "_" + serialnoNumber] = {
          "SORT_TYPE_45": specialValues[0],
          "SORT_VALUE_45": specialValues[1],
          "hs300_custom_ins_select": specialValues[2]
        };
        KyFromUtil.setItemValue(formId, "specialVal_" + serialnoNumber, "tbga_custom_rank□" + specialValue);

        //dong改,select_ 取值：由高到低（仅限于正直）val
        var select_ = $("#SORT_TYPE_45 option:selected").text();
        var ysfHuiXian = select_ + " 前";
        if (specialValues[1] == null || specialValues[1] == '') {
          ysfHuiXian = select_;
        } else {
          ysfHuiXian = select_ + " 前" + specialValues[1] + "名"
        }
        $("#operatorSelect_" + serialnoNumber).parent().find("div > a > span").eq(0)
          .text(ysfHuiXian);
        //dong改,select_ 取值：由高到低（仅限于正直）val

      } else if (indexNo = "IC10002000300070") {
        var specialValue = indexParamObj[indexNo + "_" + serialnoNumber]["tbye_custom_rank"];
        var specialValues = specialValue.split("@");
        specialValObj[indexNo + "_" + serialnoNumber] = {
          "SORT_OPTION_1122": specialValues[0],
          "SORT_VALUE_1122": specialValues[1]
        };
        KyFromUtil.setItemValue(formId, "specialVal_" + serialnoNumber, "tbye_custom_rank□" + specialValue);

        //dong改,select_ 取值：由高到低（仅限于正直）val
        var select_ = $("#SORT_OPTION_1122 option:selected").text();
        var ysfHuiXian = select_ + " 前";
        if (specialValues[1] == null || specialValues[1] == '') {
          ysfHuiXian = select_;
        } else {
          ysfHuiXian = select_ + " 前" + specialValues[1] + "名"
        }
        $("#operatorSelect_" + serialnoNumber).parent().find("div > a > span").eq(0)
          .text(ysfHuiXian);
        //dong改,select_ 取值：由高到低（仅限于正直）val
      }
    } else {
      //
      KyFromUtil.setItemValue(formId, "selectValueInput_" + serialnoNumber, indexNumber);//设置数值下拉
      var numberValue = KyFromUtil.getItemValue(formId, "selectValueInput_" + serialnoNumber);//获取数值
      if (numberValue == "--请选择--" || isNull(numberValue)) {//如果为空，表示数值不存在下拉，把下拉切换成文本框
        $("#selectValueButton_" + serialnoNumber).click();
        KyFromUtil.setItemValue(formId, "selectValueInput_" + serialnoNumber, indexNumber);//设置数值
      }
    }
    KyFromUtil.setItemValue(formId, "selectIndexUnit_" + serialnoNumber, indexUnit);//设置单位
    /*******************************特殊数值处理************************************************/
    var numberArray = ["history_asy_avg", "industry_asy_avg", "history_asj_avg", "industry_asj_avg", "debt_ratio"];
    if (numberArray.indexOf(indexNumber) >= 0) {
      var indexNoNumber = indexData[i]["tisSerialno"];
      getNumberColValue(indexNoNumber, serialnoNumber, indexNumber);
    }
  }
  /**************************回显条件表达式**************************************/
  $("#condition_expression").val(strategyData["vcWhere"]);
  strategyUpdateId = "";

}

/**
 * 指标排序评分选股
 */
function setIndexSortValue(data) {
  index_weight = true;
  /**************************回显指标**************************************/
  var strategyData = data["strategy"];
  var indexData = data["strategyIndex"];
  indexParamObj = data["indexParameter"];

  //设置权重记录数组变量
  var vcTsiWeights=[];

  //先判断页面等权重按钮是否已经被勾选，如果已经被勾选则先取消勾选，再判断值是否相等后勾上
  if($(".proportioning_weight_check").attr("checked")=="checked"){
    $(".proportioning_weight_check").attr("checked",false);
  }

  for (var i = 0; i < indexData.length; i++) {
    var indexNo = indexData[i]["tisSerialno"].split("_")[0]; //指标id
    var serialnoNumber = indexData[i]["serialNoNbumber"];//指标序号
    _indexCount = serialnoNumber - 1;
    var indexParam = indexData[i]["vcTsiParam"].split("△");//指标参数回显值
    var indexYsf = indexData[i]["vcTsiYsf"];//指标运算符
    //将指标权重数据保存进记录数组中
    vcTsiWeights.push(indexData[i]["vcTsiYsf"]);
    var indexNumber = indexData[i]["vcTsiNumber"];//指标数值
    var node = indexCategoryTreeObj.getNodeByParam("id", indexNo);//获取树图节点对象
    indexCategoryTreeSettings.callback.onClick(null, indexCategoryTreeObj.setting.treeId, node);//设置节点选中，并触法事件
    var formId = "indexsTable";
    KyFromUtil.setItemValue(formId, "setParamInput_" + serialnoNumber, indexParam[0]);//设置参数回显值
    KyFromUtil.setItemValue(formId, "setParamInputHidden_" + serialnoNumber, indexParam[1]);//设置参数回显值
    KyFromUtil.setItemValue(formId, "proportioning_weight_" + serialnoNumber, indexYsf);//设置配比权重
    KyFromUtil.setItemValue(formId, "ranking_rule_" + serialnoNumber, indexNumber);//设置排序得分规则
  }



  //用于判断是否等权重的变量 0代表值全相等  大于0则代表权重值不全相等
  var weightFlag=0;
  //循环权重数组，判断是否是等权重，如果为等权重则联动勾选等权重按钮
  if(vcTsiWeights!=null && vcTsiWeights.length>0){
    if(vcTsiWeights.length>=2){
      for (var i = 1; i < vcTsiWeights.length; i++) {
        if(vcTsiWeights[i]==vcTsiWeights[i-1]){
          //前后两个权重值相等，如果全部前后两个值都相等则为等权重
        }else{
          //如果前后两个权重值不相等，则标识变量自增1,
          weightFlag++;
        }
      }
    }
    if(weightFlag==0){
      $(".proportioning_weight_check").attr("checked","checked");
    }
    //重置标识变量
    weightFlag=0;

  }
  /**************************回显条件表达式**************************************/
    //如果排序的条件表达式为input的number类型框就先让其切换成下拉框
  var inputType=$("#conditional-expression").attr("type");
  if (inputType =='number') {
    $("#conditional-expression-btn").click();
  }
  //每次切换前需重置行业排名选项值
  $("#conditional-expression>option:last-child").val("customize");
  $("#conditional-expression>option:nth-last-child(2)").val("percent");
  $("#conditional-expression>option:nth-last-child(3)").val("industry");
  var objSelect = document.getElementById("conditional-expression");
  var selectValue = "";
  if (objSelect!=null && objSelect !=''){
    for (var j = 0; j < objSelect.length; j++) {
      if (objSelect[j].value == strategyData["vcWhere"]) {
        objSelect[j].selected = true;
        selectValue = strategyData["vcWhere"];
      } else {
        objSelect[j].selected = false;
      }
    }
  }

  $("#conditional-expression").trigger("change");
  if (isNull(selectValue)) {
    //$("#conditional-expression-btn").click();
    if(strategyData["vcWhere"].indexOf("@") != -1 == true){
      if(strategyData["vcWhere"].indexOf("△") != -1 == true){//判断是否是行业排序
        if(strategyData["vcWhere"].indexOf("%") != -1 == true){//判断是否是行业百分比排序
          $("#s2id_conditional-expression").select2("val",["industry"]);
          var a = strategyData["vcWhere"].split("@");
          var b = a[1].split("△");
          if (b[0] == "MC1000400010") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(申万一级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000400020") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(申万二级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000400030") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(申万三级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000300010") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(中信一级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000300020") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(中信二级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000300030") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(中信三级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000500010") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(证监会一级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000500020") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(证监会二级子行业" + "前" + b[1] + "%）");
          } else if (b[0] == "MC1000500030") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业百分比排名(证监会三级子行业" + "前" + b[1] + "%）");
          }
          $("#conditional-expression>option:nth-last-child(3)").val(strategyData["vcWhere"]);

          $("#industry_ratio_select_hidden").val(b[0]);
          $("#sort_value_industry_hidden").val(b[1]);
        }else{
          $("#s2id_conditional-expression").select2("val",["customize"]);
          var a = strategyData["vcWhere"].split("@");
          var b = a[1].split("△");
          if (b[0] == "MC1000400010") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(申万一级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000400020") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(申万二级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000400030") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(申万三级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000300010") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(中信一级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000300020") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(中信二级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000300030") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(中信三级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000500010") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(证监会一级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000500020") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(证监会二级子行业" + "前" + b[1] + "名）");
          } else if (b[0] == "MC1000500030") {
            $("#conditional-expression").parent().find("span:eq(0)").text("行业排名(证监会三级子行业" + "前" + b[1] + "名）");
          }

          //$("#s2id_conditional-expression").select2("val",["customize"]);
          $("#conditional-expression>option:last-child").val(strategyData["vcWhere"]);

          $("#customize_ratio_select_hidden").val(b[0]);
          $("#sort_value_customize_hidden").val(b[1]);
        }
      }else {
        $("#s2id_conditional-expression").select2("val",["percent"]);
        var a = strategyData["vcWhere"].split("@");
        var b= a[1];
        if(!isNull(b)){
          $("#conditional-expression").parent().find("span:eq(0)").text("百分比排名(" + "前" + b + "%）");
        }

        $("#conditional-expression>option:nth-last-child(2)").val(strategyData["vcWhere"]);
        $("#sort_value_percent_hidden").val(b[1]);
      }

    }else {
      $("#conditional-expression-btn").click();
      $("#conditional-expression").val(strategyData["vcWhere"]);
    }


  }
  index_weight = false;
  strategyUpdateId = "";
}

/**
 * 获取特殊数值回显数据
 */
function getNumberColValue(indexNo, serialnoNumber, indexNumber) {
  //indexNo   IC1000300010_3
  var indexNoArray = indexNo.split("_");
  var indexObj = indexParamObj[indexNo];
  var formId = "indexsTable";
  if (indexNumber == "history_asy_avg") {//市盈率PE(TTM)历史均值
    var hisValue = indexObj["tbfa_his_value"];
    $("#selectValueInput_" + serialnoNumber + "_hiddenval").val(hisValue);
    //recent_five_years   hisValue
    if (hisValue.indexOf("△") >= 0) {
      var hisValeArray = hisValue.split("△");
      specialValObj[indexNo] = {
        syl_his_avg_range: "custom_range",
        syl_his_avg_from: hisValeArray[0],
        syl_his_avg_to: hisValeArray[1]
      }
    } else {
      specialValObj[indexNo] = {
        syl_his_avg_range: hisValue
      };

      //dong改，页面回显
      var str = "";
      if (hisValue == "recent_five_years") {
        str = "最近5年";
      } else if (hisValue == "recent_ten_years") {
        str = "最近10年";
      } else if (hisValue == "2005_to_now") {
        str = "2005-01-01至今";
      } else if (hisValue == "custom_range") {
        var start = $("input[name='syl_his_avg_from']").val();
        var end = $("input[name='syl_his_avg_to']").val();
        str = start + " 至 " + end;
      }
      $("#s2id_selectValueInput_" + serialnoNumber)
        .parent().find("div > a > span").eq(0).text("历史均值(" + str + ")");
      //dong改，页面回显
    }
    KyFromUtil.setItemValue(formId, "specialVal_" + serialnoNumber, "tbfa_his_value□" + hisValue);
  } else if (indexNumber == "industry_asy_avg") {//市盈率PE(TTM)行业均值
    var hisValue = indexObj["tbfa_ins_value"];
    $("#selectValueInput_" + serialnoNumber + "_hiddenval").val(hisValue);
    specialValObj[indexNo] = {
      syl_ins_avg_ins_select: hisValue
    };
    //dong改 v是行业名字，页面回显
    var v = getIndustryNameById(hisValue);
    $("#s2id_selectValueInput_" + serialnoNumber)
      .parent().find("div > a > span").eq(0).text("行业均值(" + v + ")");
    KyFromUtil.setItemValue(formId, "specialVal_" + serialnoNumber, "tbfa_ins_value□" + hisValue);
  } else if (indexNumber == "history_asj_avg") { //市净率PB历史均值
    var hisValue = indexObj["tbfb_his_value"];
    $("#selectValueInput_" + serialnoNumber + "_hiddenval").val(hisValue);
    if (hisValue.indexOf("△") >= 0) {
      var hisValeArray = hisValue.split("△");
      specialValObj[indexNo] = {
        sjl_his_avg_range: "custom_range",
        sjl_his_avg_from: hisValeArray[0],
        sjl_his_avg_to: hisValeArray[1]
      }
    } else {
      specialValObj[indexNo] = {
        sjl_his_avg_range: hisValue
      }
    }
    //dong改
    var str = "";
    if (hisValue == "recent_five_years") {
      str = "最近5年";
    } else if (hisValue == "recent_ten_years") {
      str = "最近10年";
    } else if (hisValue == "2005_to_now") {
      str = "2005-01-01至今";
    } else if (hisValue == "custom_range") {
      var start = $("input[name='syl_his_avg_from']").val();
      var end = $("input[name='syl_his_avg_to']").val();
      str = start + " 至 " + end;
    }
    $("#s2id_selectValueInput_" + serialnoNumber)
      .parent().find("div > a > span").eq(0).text("历史均值(" + str + ")");
    //dong改
    KyFromUtil.setItemValue(formId, "specialVal_" + serialnoNumber, "tbfb_his_value□" + hisValue);
  } else if (indexNumber == "industry_asj_avg") {//市净率PB行业均值
    var hisValue = indexObj["tbfb_ins_value"];
    $("#selectValueInput_" + serialnoNumber + "_hiddenval").val(hisValue);
    specialValObj[indexNo] = {
      sjl_ins_avg_ins_select: hisValue
    };
    //dong v是行业名字，页面回显
    var v = getIndustryNameById(hisValue);
    $("#s2id_selectValueInput_" + serialnoNumber)
      .parent().find("div > a > span").eq(0).text("行业均值(" + v + ")");

    KyFromUtil.setItemValue(formId, "specialVal_" + serialnoNumber, "tbfb_ins_value□" + hisValue);
  } else if (indexNumber == "debt_ratio") {//资产负债率 行业负债率
    var hisValue = indexObj["tbba_industry_select"];
    specialValObj[indexNo] = {
      debt_ratio_select: hisValue
    };
    $("#selectValueInput_" + serialnoNumber + "_hiddenval").val(hisValue);

    //dong v是行业名字，页面回显
    var v = getIndustryNameById(hisValue);
    $("#s2id_selectValueInput_" + serialnoNumber)
      .parent().find("div > a > span").eq(0).text("行业资产负债率(" + v + ")");
    KyFromUtil.setItemValue(formId, "specialVal_" + serialnoNumber, "tbba_industry_select□" + hisValue);
  }
}

//自定义 判断根据行业id选择行业名字  例如：MC1000400010 对应名字 申万一级子行业
var IndustryId = "";

function getIndustryNameById(IndustryId) {
  var resultName = "";
  if (IndustryId != "" && IndustryId != null) {
    switch (IndustryId) {
      case "MC1000400010":
        return "申万一级子行业";
        break;
      case "MC1000400020":
        return "申万二级子行业";
        break;
      case "MC1000400030":
        return "申万三级子行业";
        break;
      case "MC1000300010":
        return "中信一级子行业";
      case "MC1000300020":
        return "中信二级子行业";
        break;
      case "MC1000300030":
        return "中信三级子行业";
        break;
      case "MC1000500010":
        return "证监会一级子行业";
        break;
      case "MC1000500020":
        return "证监会二级子行业";
        break;
      case "MC1000500030":
        return "证监会三级子行业";
      default:
        return "";
    }
  }
  return "";
}


//设置全部日期选择不可输入
function setDateInput() {

  /*$(".date-picker input").bind("focus",function(){


			$(".date-picker-year input").bind("focus",function(){

				this.blur();
			});*/


  //$(".date-picker input").attr("onfocus",this.blur());
}

//组合函数
function combination(arr, size) {
  var allResult = [];
  (function (arr, size, result) {
    var arrLen = arr.length;
    if (size > arrLen) {
      return;
    }
    if (size == arrLen) {
      allResult.push([].concat(result, arr))
    } else {
      for (var i = 0; i < arrLen; i++) {
        var newResult = [].concat(result);
        newResult.push(arr[i]);

        if (size == 1) {
          allResult.push(newResult);
        } else {
          var newArr = [].concat(arr);
          newArr.splice(0, i + 1);
          arguments.callee(newArr, size - 1, newResult);
        }
      }
    }
  })(arr, size, []);

  return allResult;
}

//删除选股模板
function deleteStockModel(data) {
  var selectedStrategyModelId = data;
  if (selectedStrategyModelId && strategyModelStatusArr[selectedStrategyModelId] == "0060") {
    $.ajax({
      url: _basePath + "/app/sharePolicy/page/strategyModel/delete",
      data: {
        selectedStrategyModelId: selectedStrategyModelId
      },
      async: true,
      cache: false,
      dataType: "text",
      success: function (data) {
        if (data == "success") {
          initPage();
          parent.kyTools.message({type: 'success', message: '删除成功'}, {closeInSeconds: 3});
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
        parent.kyTools.message({type: 'error', message: '删除失败'}, {closeInSeconds: 3});
      }
    });
  } else if (selectedStrategyModelId && strategyModelStatusArr[selectedStrategyModelId] == "0010") {
    parent.kyTools.message({type: 'error', message: '有效策略选股条件不可删除'}, {closeInSeconds: 3});
  } else {
    parent.kyTools.message({type: 'error', message: '请先勾选需要删除的模板'}, {closeInSeconds: 3});
  }
}

function initSelect2Tables() {
  var option = {
    /**标题**/
    header: ['方案名称', '状态', '操作'],
    /**需要显示的内容**/
    showContent: 1,
    defaultType: "radio",
    src: $("#select_Table"),
    callback: {
      /***
       * 清除X事件
       * @param obj 当前x的对象
       */
      clearClick: function (obj) {
        //console.log($(obj).attr("class"));
      }
    },
    onSuccess: function (grid) {

    },
    onError: function (grid) {

    },
    onDataLoad: function (grid) {

    },
    //dong
    rowclick: function (u, the, self, e, checkData, checkText) {
      //当前选股模板不清空
      $("#tbodyId").empty();
      $("#stockResults").empty();
      $("#condition_expression").val("");
      clearTmpObj();
      selectedStrategyModelId = checkData[0];
      strategyUpdateId = checkData[0];
      strategyUpdatInit();
      /* $("#customize_ratio_select_hidden").val("");
             $("#sort_value_customize_hidden").val("");*/
      $("#select_Table_select2TableDrop").css("display", "none");
    },
    dataTable: {
      "language": { // language settings
        // metronic spesific
        "metronicGroupActions": "_TOTAL_ 条 被选中.",
        "metronicAjaxRequestGeneralError": "请求失败. 请检查您的网络!",
        // data tables spesific
        "lengthMenu": "<span style='float: left;' class='seperator'>每页显示</span>_MENU_条",
        "info": "<span class='seperator'>从_START_ 到 _END_ 条记录——</span> 总数为 _TOTAL_ 条",
        "infoEmpty": "记录数为0",
        "infoFiltered" : "(全部记录数 _MAX_条)",
        "emptyTable": "没有数据",
        "zeroRecords": "没有您要搜索的内容",
        "paginate": {
          "previous": "上一页",
          "next": "下一页",
          "last": "最后一页",
          "first": "第一页",
          "page": "第",
          "pageOf": "共"
        }
      },
      "ajax": {
        "url": base + "/app/sharePolicy/page/list/getListData",
      },
      "columns": [
        {
          "data": "vcSerialno",
          "render": function (data, type, full, meta) {
            return '<label><input type="radio"   name="radio"   value="' + data + '" /></label>';
          },
        },
        {
          "data": "vcStrategyName",
          "render": function (data) {
            strategyNameArr.push(data);
            return data;
          }
        },
        {
          "data": "vcStatus",
          "render": function (data, type, full, meta) {
            strategyModelStatusArr[full.vcSerialno] = full.vcStatus;
            if (data == '0010') {
              var ret = "有效策略";
              if(full.vcState == "0040"){
                ret+="(待生效)";
              }else if(full.vcState == "0030"){
                ret+="(已生效)";
              }
              return ret;
            }
            if (data == '0060') {
              return "模板";
            }
            return "";
          }
        },
        {
          "data": "vcSerialno",
          "render": function (data, type, full, meta) {
            return "<a href='#' onclick='deleteStockModel(\"" + data + "\")' class='btn blue default' >删除</a>";
          }
        }
      ],
      //选股模板中 以方案名称排序，方案名称的首字母拼音或数字升序
      "order": [[1, 'asc']]
    }
  };
  var t1 = selectTable();
  var grid = t1.grid();
  //grid.setAjaxParam("search_vcStrategyName_cn",'0411');
  // option.offsetTableWidth=600;
  t1.init(option);
}

//获取年份下拉选
function getYearsOptinos(option) {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth() + 1;
  var sResult = "";
  for (var i = currentYear; i >= 2005; i--) {
    sResult += "<option value='" + i + "'>" + i + "年</option>";
  }
  if (option == "0") {
    for (var j = 0; j < 2; j++) {
      sResult = "<option value='" + (currentYear + j + 1) + "'>" + (currentYear + j + 1) + "年</option>" + sResult;
    }
  }
  sResult = "<option></option>" + sResult;
  return sResult;
}

//日期参数(PEG,预测PEG,CAGR三个指标参数设置回显)（判断年度报表是否已出）
function getCagrNumberOrDesc(querydate, option, flag) {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  querydate = querydate.replace(/-/g, "");
  var queryyear = parseInt(querydate.substring(0, 4));
  var querymonthday = querydate.substring(4);
  var desc = "";
  var calcyear = "";
  if (option == "future_one_year") {
    if (querymonthday >= "0501") {
      desc = "" + queryyear;
      calcyear = queryyear;
    } else {
      desc = "" + (queryyear - 1);
      calcyear = (queryyear - 1);
    }

  } else if (option == "future_two_years") {
    if (querymonthday >= "0501") {
      desc = "" + (queryyear + 1);
      calcyear = queryyear + 1;
    } else {
      desc = "" + queryyear;
      calcyear = queryyear;
    }
  } else if (option == "future_three_years") {
    if (querymonthday >= "0501") {
      desc = "" + (queryyear + 2);
      calcyear = queryyear + 2;
    } else {
      desc = "" + (queryyear + 1);
      calcyear = queryyear + 1;
    }
  } else if (option == "past_two_years") {
    if (querymonthday >= "0501") {
      desc = "过去" + (queryyear - 3) + "-" + (queryyear - 1);
      calcyear = (queryyear - 3) + "-" + (queryyear - 1);
    } else {
      desc = "过去" + (queryyear - 4) + "-" + (queryyear - 2);
      calcyear = (queryyear - 4) + "-" + (queryyear - 2);
    }
  } else if (option == "past_three_years") {
    if (querymonthday >= "0501") {
      desc = "过去" + (queryyear - 4) + "-" + (queryyear - 1);
      calcyear = (queryyear - 4) + "-" + (queryyear - 1);
    } else {
      desc = "过去" + (queryyear - 5) + "-" + (queryyear - 2);
      calcyear = (queryyear - 5) + "-" + (queryyear - 2);
    }
  } else if (option == "future_two_years_middle") {
    if (querymonthday >= "0501") {
      desc = "未来" + (queryyear - 1) + "-" + (queryyear + 1) + "中值";
      calcyear = (queryyear - 1) + "-" + (queryyear + 1);
    } else {
      desc = "未来" + (queryyear - 2) + "-" + (queryyear) + "中值";
      calcyear = (queryyear - 2) + "-" + (queryyear);
    }
  } else if (option == "future_two_years_avg") {
    if (querymonthday >= "0501") {
      desc = "未来" + (queryyear - 1) + "-" + (queryyear + 1) + "均值";
      calcyear = (queryyear - 1) + "-" + (queryyear + 1);
    } else {
      desc = "未来" + (queryyear - 2) + "-" + (queryyear) + "均值";
      calcyear = (queryyear - 2) + "-" + (queryyear);
    }
  } else if (option == "future_three_years_middle") {
    if (querymonthday >= "0501") {
      desc = "未来" + (queryyear - 1) + "-" + (queryyear + 2) + "中值";
      calcyear = (queryyear - 1) + "-" + (queryyear + 2);
    } else {
      desc = "未来" + (queryyear - 2) + "-" + (queryyear + 1) + "中值";
      calcyear = (queryyear - 2) + "-" + (queryyear + 1);
    }
  } else if (option == "future_three_years_avg") {
    if (querymonthday >= "0501") {
      desc = "未来" + (queryyear - 1) + "-" + (queryyear + 2) + "均值";
      calcyear = (queryyear - 1) + "-" + (queryyear + 2);
    } else {
      desc = "未来" + (queryyear - 2) + "-" + (queryyear + 1) + "均值";
      calcyear = (queryyear - 2) + "-" + (queryyear + 1);
    }
  }
  if (flag == "0") {
    return calcyear;
  } else {
    return desc;
  }
}

//去除数组中重复的数据
function removeDuplicationString(oldArr) {
  var newArr = [];
  //排序去重
  oldArr = oldArr.sort();
  newArr = $.unique(oldArr);
  return newArr;
}
//市盈率运算符数字限制
$("#SORT_VALUE_44").on("input propertychange",function() {
  //数字文本框内容限制
  zh_util.numberInputLimiter({id: "SORT_VALUE_44"});
});

var clearNoNum = function(obj){
  obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
  obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
  obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
  obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
  if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    obj.value= parseFloat(obj.value);
  }
};

//只允许输入数字 cail
var OnlyNum = function(obj){
  obj.value=obj.value.replace(/\D/g,'')
};

//只允许输入数字和一个小数点 cail
function clearNoNumber(_this){
  var result = $(_this).val().replace(/\D/g,'');
  $(_this).val(result);
}
$('#SORT_VALUE_44').on('focus',function () {
  clearNoNumber(this);
});
$('#SORT_VALUE_44').on('keyup',function () {
  clearNoNumber(this);
});
$('#SORT_VALUE_44').on('blur',function () {
  clearNoNumber(this);
});


$('#SORT_VALUE_1122').on('focus',function () {
  clearNoNumber(this);
});
$('#SORT_VALUE_1122').on('keyup',function () {
  clearNoNumber(this);
});
$('#SORT_VALUE_1122').on('blur',function () {
  clearNoNumber(this);
});

$('#SORT_VALUE_45').on('focus',function () {
  clearNoNumber(this);
});
$('#SORT_VALUE_45').on('keyup',function () {
  clearNoNumber(this);
});
$('#SORT_VALUE_45').on('blur',function () {
  clearNoNumber(this);
});
//校验模板名称是否被使用
function checkModelNameExit(modelName){
  var result="";
  $.ajax({
    url: base + "/app/sharePolicy/page/strategy/checkPlanName",
    type: "GET",
    data: {
      planName: modelName
    },
    async: false,
    cache: false,
    dataType: "json",
    success: function (data) {
      result=data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
    }
  });

  return result;
}
