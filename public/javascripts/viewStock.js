$(function () {
    //console.log($.getJSON('https://chartapi.finance.yahoo.com/instrument/1.0/'+this.symbol+'/chartdata;type=quote;range=1d/jsonp.php'))
    //$.getJSON("https://chartapi.finance.yahoo.com/instrument/1.0/aapl/chartdata;type=quote;range=1d/json?callback=?",function(json){
    //    console.log(json);
    //});
});

var _now = new Date(),
    _chart;


function renderYahoo(name, data) {
    data = data['Time Series (5min)'];
    var listData = [];
    //console.log(data['Time Series (15min)']);
    for(row in data){
        //console.log(row);
        tempArr = [new Date(row).getTime(), parseFloat(data[row]['1. open']), parseFloat(data[row]['2. high']), parseFloat(data[row]['3. low']), parseFloat(data[row]['4. close']), parseFloat(data[row]['5. volume'])];
        //console.log(tempArr);
        listData.push(tempArr);
    }

    listData = listData.reverse();
    
    var ohlcSeries = {
        name: name,
        data: listData,
        type: 'line',
        //http://stackoverflow.com/questions/9849806/data-grouping-into-weekly-monthly-by-user
        //dataGrouping: { enabled: false },
        tooltip: {
                valueDecimals: 2
            },
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
            threshold: null
        
    };
    _chart.addSeries(ohlcSeries);
}


$(function () {
    _chart = new Highcharts.StockChart({
        chart: {
            renderTo: document.querySelector('#chart1 .chart')
        },
        title: {
            text: ticker
        },
        rangeSelector: {
            buttons: [{
                type: 'hour',
                count: 1,
                text: '1H'
            }, {
                type: 'day',
                count: 1,
                text: '1D'
            }, {
                type: 'day',
                count: 7,
                text: '1W'
            },{
                type: 'month',
                count: 1,
                text: '1M'
            }, {
                type: 'all',
                count: 1,
                text: 'All'
            }],
            selected: 1,
            inputEnabled: false
        },
        NumberOfDays: 30,
        DataPeriod: "minute",
        DataInterval: 1
    });
    
    
    //Responds with 404 through crossorigin.me. Alternative service:
    //https://www.bountysource.com/issues/39833634-origin-header-is-required
    //  var url = '//crossorigin.me/' + createUrlYahoo(ticker, from, to);
    var url = 'http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&apikey=50JC?callback=?';

    var ticker = 'MSFT';
    
    $.ajax({
        url: 'http://cors-anywhere.herokuapp.com/http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+ticker+'&interval=5min&outputsize=full&apikey=50JC',
        //document.write('<pre>'+data+'</pre>');
        dataType: "json",
        context: this,
        success: function(json){
            console.log(json);
            renderYahoo(ticker, json);
        }
    });
});


