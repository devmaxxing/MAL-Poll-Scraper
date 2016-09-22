var reader;
var animeJSON;
var data;
var episodes;

$(function(){
    reader = new FileReader();
    reader.onload = function(e){
        animeJSON = JSON.parse(e.target.result);
        generateChart(sortByMean);
    };

    $("#fileInput").change(function(e){
        var file = e.target.files[0];        
        reader.readAsText(file);
    });
});

function sortByMean(a,b){
    if(a.mean>b.mean)
        return 1
    else if(a.mean<b.mean)
        return -1
    return 0
}

function sortByEpisode(a,b){
    if(a.episodeNumber>b.episodeNumber)
        return 1
    else if(a.episodeNumber<b.episodeNumber)
        return -1
    return 0
}

function generateChart(sortCompare){
    animeJSON.sort(sortCompare);

    data = [[],[],[],[],[],[]];
    episodes = [];

    for(episode of animeJSON){
        episodes.push("Episode " + episode.episodeNumber);
        data[0].push(episode.mean);
        console.log(episode.EpisodeNumber);
        for(var i = 0; i < 5; i++){
            data[i+1].push(episode.ratings[i]);            
        }
    }

    $('#animeChart').highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: animeJSON[0].anime + ' Episode Ratings'
        },
        scrollbar: {
            enabled: true
        },
        xAxis: [{
            categories: episodes,
            crosshair: true,
            min: 0,
            max: 15
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Number of Votes',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            min: 0,
            max:5,
            title: {
                text: 'Mean Score',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'horizontal',
            backgroundColor: '#FFFFFF',
            maxHeight: 50,
            width: 500,
        },
        series: [{
            name: 'Mean Score',
            type: 'column',
            yAxis: 1,
            data: data[0]
        }, {
            name: '5',
            type: 'column',
            data: data[1],
            tooltip: {
                valueSuffix: ' votes'
            }
        }, {
            name: '4',
            type: 'column',
            data: data[2],
            tooltip: {
                valueSuffix: ' votes'
            }
        }, {
            name: '3',
            type: 'column',
            data: data[3],
            tooltip: {
                valueSuffix: ' votes'
            }
        }, {
            name: '2',
            type: 'column',
            data: data[4],
            tooltip: {
                valueSuffix: ' votes'
            }
        }, {
            name: '1',
            type: 'column',
            data: data[5],
            tooltip: {
                valueSuffix: ' votes'
            }
        }]
    });
}