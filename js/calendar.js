var calUtil = {
  //当前日历显示的年份
  showYear:2015,
  //当前日历显示的月份
  showMonth:1,
  //当前日历显示的天数
  showDays:1,
  eventName:"load",
  
  
  //初始化日历
  init:function(errorDayList,workList){
    calUtil.setMonthAndDay();
    calUtil.draw(errorDayList,workList);
    calUtil.bindEnvent(errorDayList);
  },
  
  draw:function(errorDayList,workList){
    //绑定日历
    var str = calUtil.drawCal(calUtil.showYear,calUtil.showMonth,errorDayList,workList);
    $("#calendar").html(str);
    //绑定日历表头
    var calendarName=calUtil.showYear+"年"+calUtil.showMonth+"月";
    $(".calendar_month_span").html(calendarName);  
  },
  //绑定事件
  bindEnvent:function(errorDayList){
    //绑定上个月事件
    $(".calendar_month_prev").click(function(){
      //ajax获取日历json数据
      calUtil.eventName="prev";
      var flag = "pre";
      getSignDayByMonth(flag);
    });
    //绑定下个月事件
    $(".calendar_month_next").click(function(){
      //ajax获取日历json数据
      calUtil.eventName="next";
      var flag = "nex";
      getSignDayByMonth(flag);
    });
  },
  //获取当前选择的年月
  setMonthAndDay:function(){
    switch(calUtil.eventName)
    {
      case "load":
        var current = new Date();
        calUtil.showYear=current.getFullYear();
        calUtil.showMonth=current.getMonth() + 1;
        break;
      case "prev":
        var nowMonth=$(".calendar_month_span").html().split("年")[1].split("月")[0];
        calUtil.showMonth=parseInt(nowMonth)-1;
        if(calUtil.showMonth==0)
        {
            calUtil.showMonth=12;
            calUtil.showYear-=1;
        }
        break;
      case "next":
        var nowMonth=$(".calendar_month_span").html().split("年")[1].split("月")[0];
        calUtil.showMonth=parseInt(nowMonth)+1;
        if(calUtil.showMonth==13)
        {
            calUtil.showMonth=1;
            calUtil.showYear+=1;
        }
        break;
    }
  },
  getDaysInmonth : function(iMonth, iYear){
   var dPrevDate = new Date(iYear, iMonth, 0);
   return dPrevDate.getDate();
  },
  bulidCal : function(iYear, iMonth) {
   var aMonth = new Array();
   aMonth[0] = new Array(7);
   aMonth[1] = new Array(7);
   aMonth[2] = new Array(7);
   aMonth[3] = new Array(7);
   aMonth[4] = new Array(7);
   aMonth[5] = new Array(7);
   aMonth[6] = new Array(7);
   var dCalDate = new Date(iYear, iMonth - 1, 1);
   var iDayOfFirst = dCalDate.getDay();
   var iDaysInMonth = calUtil.getDaysInmonth(iMonth, iYear);
   var iVarDate = 1;
   var d, w;
   aMonth[0][0] = "日";
   aMonth[0][1] = "一";
   aMonth[0][2] = "二";
   aMonth[0][3] = "三";
   aMonth[0][4] = "四";
   aMonth[0][5] = "五";
   aMonth[0][6] = "六";
   for (d = iDayOfFirst; d < 7; d++) {
    aMonth[1][d] = iVarDate;
    iVarDate++;
   }
   for (w = 2; w < 7; w++) {
    for (d = 0; d < 7; d++) {
     if (iVarDate <= iDaysInMonth) {
      aMonth[w][d] = iVarDate;
      iVarDate++;
     }
    }
   }
   return aMonth;
  },
  ifHasSigned : function(errorDayList,day){
   var signed = false;
   $.each(errorDayList,function(index,item){
    if(item.errorDay == day) {
     signed = true;
     return false;
    }
   });
   return signed ;
  },
  ifWorkDay : function(workDayList,day){
	   var workday = false;
	   $.each(workDayList,function(index,item){
	    if(item.workDay == day) {
	    workday = true;
	     return false;
	    }
	   });
	   return workday ;
	  },
  drawCal : function(iYear, iMonth ,errorDayList,workList) {
   var myMonth = calUtil.bulidCal(iYear, iMonth);
   var htmls = new Array();
   htmls.push("<div class='sign_main' id='sign_layer'>");
//   htmls.push("<div class='sign_succ_calendar_title'>");
   htmls.push("<div class='calendar_month_next'></div>");
   htmls.push("<div class='calendar_month_prev'></div>");
   htmls.push("<div id = 'calendar_month_span' class='calendar_month_span'></div>");
   htmls.push("</div>");
   htmls.push("<div id = 'blank' class='blank'></div>");
   htmls.push("<div class='sign' id='sign_cal'>");
   htmls.push("<table id='table1' class='table1'>");
   htmls.push("<tr>");
   htmls.push("<th class ='weekCss'>" + myMonth[0][0] + "</th>");
   htmls.push("<th>" + myMonth[0][1] + "</th>");
   htmls.push("<th>" + myMonth[0][2] + "</th>");
   htmls.push("<th>" + myMonth[0][3] + "</th>");
   htmls.push("<th>" + myMonth[0][4] + "</th>");
   htmls.push("<th>" + myMonth[0][5] + "</th>");
   htmls.push("<th>" + myMonth[0][6] + "</th>");
   htmls.push("</tr>");
   var d, w;
   for (w = 1; w < 6; w++) {
    htmls.push("<tr>");
    for (d = 0; d < 7; d++) {
     var ifHasSigned = calUtil.ifHasSigned(errorDayList,myMonth[w][d]);
     var ifWorkDay = calUtil.ifWorkDay(workList,myMonth[w][d]);
     console.log(ifHasSigned);
     if(ifHasSigned){
    	 if(ifWorkDay){
    		 //工作日
    		 if(!isNaN(myMonth[w][d])){
    			 htmls.push("<td  onclick='tdClick(this)' class='onWorkError'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</td>");
    		 }else{
    			 htmls.push("<td class ='ds'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</td>");
    		 }
    		 
    	 }else{
    		 if(!isNaN(myMonth[w][d])){
    			 htmls.push("<td  onclick='tdClick(this)' class='onNotWorkError'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</td>");
    		 }else{
    			 htmls.push("<td class ='ds'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</td>");
    		 }
    	 }
     } else {
    	 if(ifWorkDay){
    		 if(!isNaN(myMonth[w][d])){
    			  htmls.push("<td onclick='tdClick(this)' class= 'Work'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</td>");
    		 }else{
    			 htmls.push("<td class ='ds'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</td>");
    		 }
    	 }else{
    		 if(!isNaN(myMonth[w][d])){
    			  htmls.push("<td onclick='tdClick(this)' class= 'notWork'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</td>");
    		 }else{
    			 htmls.push("<td class ='ds'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</td>");
    		 }
    	 }
     }
    }
    htmls.push("</tr>");
   }
   htmls.push("</table>");
   htmls.push("</div>");
   htmls.push("</div>");
   return htmls.join('');
  }
};
