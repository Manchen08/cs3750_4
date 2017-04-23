/** 
 * Version 1.0, Jan 2012
 */

var Markit = {};

/**
* Define the QuoteService.
* First argument is symbol (string) for the quote. Examples: AAPL, MSFT, JNJ, GOOG.
* Second argument is fCallback, a callback function executed onSuccess of API.
*/
Markit.QuoteService = function(sSymbol, fCallback) {
    this.symbol = sSymbol;
    this.fCallback = fCallback;
    this.DATA_SRC = "http://cors-anywhere.herokuapp.com/http://dev.markitondemand.com/Api/v2/Quote/json";
    this.makeRequest();
};
/**
* Ajax success callback. fCallback is the 2nd argument in the QuoteService constructor.
*/
Markit.QuoteService.prototype.handleSuccess = function(jsonResult) {
    console.log(jsonResult);
    this.fCallback(jsonResult);
};
/**
* Ajax error callback
*/
Markit.QuoteService.prototype.handleError = function(jsonResult) {
    console.error(jsonResult);
};
/** 
* Starts a new ajax request to the Quote API
*/
Markit.QuoteService.prototype.makeRequest = function() {
    //Abort any open requests
    if (this.xhr) { this.xhr.abort(); }
    //Start a new request
    this.xhr = $.ajax({
        data: { symbol: this.symbol },
        url: this.DATA_SRC,
        dataType: "json",
        success: this.handleSuccess,
        error: this.handleError,
        context: this
    });
};

new Markit.QuoteService("AAPL", function(jsonResult) {

    //Catch errors
    if (!jsonResult || jsonResult.Message){
        console.error("Error: ", jsonResult.Message);
        return;
    }

    //If all goes well, your quote will be here.
    console.log(jsonResult);

    //Now proceed to do something with the data.
    $("h1").first().text(jsonResult.Name);

    /**
    * Need help? Visit the API documentation at:
    * http://dev.markitondemand.com
    */
});



/**
 * Define the InteractiveChartApi.
 * First argument is symbol (string) for the quote. Examples: AAPL, MSFT, JNJ, GOOG.
 * Second argument is duration (int) for how many days of history to retrieve.
 */
Markit.InteractiveChartApi = function(symbol,duration,chartDiv){
    this.symbol = symbol.toUpperCase();
    this.duration = duration;
    this.PlotChart($(chartDiv));
};

Markit.InteractiveChartApi.prototype.PlotChart = function(chartDiv){
    
    var params = {
        parameters: JSON.stringify( this.getInputParams() )
    }

   // $.getJSON("https://chartapi.finance.yahoo.com/instrument/1.0/aapl/chartdata;type=quote;range=1d/json?callback=?",function(json){
   //     console.log(json);
   //     this.render(json,$(chartDiv));
   // });

    //Make JSON request for timeseries data
    $.ajax({
        beforeSend:function(){
            $(chartDiv).text("Loading chart...");
        },
        data: params,
        url: 'http://cors-anywhere.herokuapp.com/http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+this.symbol+'&interval=5min&outputsize=full&apikey=50JC',
        dataType: "json",
        context: this,
        success: function(json){
            //Catch errors
            if (!json || json.Message){
                console.error("Error: ", json.Message);
                return;
            }
            data = json['Time Series (5min)'];
            var listData = [];
                //console.log(data['Time Series (15min)']);
                for(row in data){
                tempArr = [new Date(row).getTime(), parseFloat(data[row]['1. open']), parseFloat(data[row]['2. high']), parseFloat(data[row]['3. low']), parseFloat(data[row]['4. close']), parseFloat(data[row]['5. volume'])];
                //console.log(tempArr);
                listData.push(tempArr);
            }

            listData = listData.reverse();
            //console.log(listData);
            this.render(listData,$(chartDiv));
        },
        error: function(response,txtStatus){
            console.log(response,txtStatus)
        }
    });
};

Markit.InteractiveChartApi.prototype.getInputParams = function(){
    return {  
        Normalized: false,
        NumberOfDays: 30,
        DataPeriod: "minute",
        DataInterval: 1,
        Elements: [
            {
                Symbol: this.symbol,
                Type: "price",
                Params: ["ohlc"] //ohlc, c = close only
            },
            {
                Symbol: this.symbol,
                Type: "volume"
            }
        ]
        //,LabelPeriod: 'Week',
        //LabelInterval: 1
    }
};

Markit.InteractiveChartApi.prototype._fixDate = function(dateIn) {
    var dat = new Date(dateIn);
    return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate(), dat.getHours(), dat.getMinutes(), dat.getSeconds(), dat.getMilliseconds());
};

Markit.InteractiveChartApi.prototype._getOHLC = function(json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];

    if (elements[0]){

        for (var i = 0, datLen = dates.length; i < datLen; i++) {
            var dat = this._fixDate( dates[i] );
            var pointData = [
                dat,
                elements[0].DataSeries['open'].values[i],
                elements[0].DataSeries['high'].values[i],
                elements[0].DataSeries['low'].values[i],
                elements[0].DataSeries['close'].values[i]
            ];
            chartSeries.push( pointData );
        };
    }
    return chartSeries;
};

Markit.InteractiveChartApi.prototype._getVolume = function(json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];
    for (var i = 0, datLen = json.length; i < datLen; i++) {
        var dat = json[i][0];
        var pointData = [
            dat,
            json[i][5]
        ];
        chartSeries.push( pointData );
    };
    return chartSeries;
};

Markit.InteractiveChartApi.prototype.render = function(data,chartDiv) {
    //console.log(data)
    // split the data set into ohlc and volume
    var ohlc = this._getOHLC(data),
        volume = this._getVolume(data);

    //console.log(ohlc);

    // set the allowed units for data grouping
    var groupingUnits = [[
        'hour',                         // unit name
        [1]                             // allowed multiples
    ],[
        'day',                         // unit name
        [1]                             // allowed multiples
    ]/*,[
        'week',                         // unit name
        [1]                             // allowed multiples
    ], [
        'month',
        [1, 2, 3, 4, 6]
    ]*/];

    // create the chart
    $(chartDiv).highcharts('stockChart', {
        
        rangeSelector: {
            buttons: [{
                type: 'hour',
                count: 1,
                text: '1H',
                dataGrouping: {
                    forced: false,
                    units: [['min', [5]]]
                }
            }, {
                type: 'day',
                count: 1,
                text: '1D',
                dataGrouping: {
                    forced: true,
                    units: [['hour', [1]]]
                }
                  
            }, {
                type: 'day',
                count: 7,
                text: '1W',
                dataGrouping: {
                    forced: true,
                    units: [['hour', [1]]]
                }
            },{
                type: 'month',
                count: 1,
                text: '1M',
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                }
            }, {
                type: 'all',
                count: 1,
                text: 'All',
                dataGrouping: {
                    forced: true,
                    units: [['week', [1]]]
                }
            }],
            selected: 1,
            inputEnabled: false
        },

        title: {
            text: this.symbol + ' Historical Price'
        },

        yAxis: [{
            title: {
                text: 'OHLC'
            },
            height: 200,
            lineWidth: 2
        }, {
            title: {
                text: 'Volume'
            },
            top: 300,
            height: 100,
            offset: 0,
            lineWidth: 2
        }],
        
        series: [{
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            type: 'line',
            name: this.symbol,
            data: data,
            dataGrouping: {
                units: groupingUnits
            },
            tooltip: {
                valueDecimals: 2
            }
        }, /*{
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        }*/],
        credits: {
            enabled:false
        }
    });
};

// exports.Markit.QuoteService = Markit.QuoteService;