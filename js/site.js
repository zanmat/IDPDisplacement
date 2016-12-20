//configuration object

var config = {
    title:"Northern Syria Displacement Tracking",
    description:"Number of newly reported displacements between October 31st and November 15th, 2016.",
    data:"data/data4.json",
    whoFieldName:"F_Subdistrict", //barsdeparture
    whatFieldName:"Nov_Change",
    whereFieldName:"T_Subdistrict", //mapdestination
    whereFieldName2:"F_Subdistrict", //mapdeparture
    statusFieldName:"T_Subdistrict", //barsdestination
    geo:"data/syria3.geojson",
    joinAttribute:"NAM_EN_REF",
    colors:['#edf8e9','#bae4b3','#74c476','#238b45','#fee5d9','#fcae91','#fb6a4a','#cb181d','#99000d']
};

//function to generate the 3W component
//data is the whole 3W Excel data set
//geom is geojson file

function generate3WComponent(config,data,geom){    
    
    $('#title').html(config.title);
    $('#description').html(config.description);

    var whoChart = dc.rowChart('#hdx-3W-who');
    var whatChart = dc.rowChart('#hdx-3W-what');
    var whereChart = dc.leafletChoroplethChart('#hdx-3W-where');
    var whereChart2 = dc.leafletChoroplethChart('#hdx-3W-where2');
    var statusChart = dc.rowChart('#hdx-3W-status');

    var cf = crossfilter(data);

    var whoDimension = cf.dimension(function(d){ return d[config.whoFieldName]; });
    var whatDimension = cf.dimension(function(d){ return d[config.whatFieldName]; });
    var whereDimension = cf.dimension(function(d){ return d[config.whereFieldName]; });
    var whereDimension2 = cf.dimension(function(d){ return d[config.whereFieldName2]; });
    var statusDimension = cf.dimension(function(d){ return d[config.statusFieldName]; });

    var whoGroup = whoDimension.group().reduceSum(function(d) {return d.Nov_Change ;});
    var whatGroup = whatDimension.group();
    var whereGroup = whereDimension.group().reduceSum(function(d) {return d.Nov_Change ;});
    var whereGroup2 = whereDimension2.group().reduceSum(function(d) {return d.Nov_Change ;});
    var statusGroup = statusDimension.group().reduceSum(function(d) {return d.Nov_Change ;});
    var all = cf.groupAll();

    whoChart.width($('#hdx-3W-who').width()).height(200)
            .dimension(whoDimension)
            .group(whoGroup)
            .elasticX(true)
            .data(function(group) {
                return group.top(5);
            })
            .labelOffsetY(13)
            .colors(config.colors)
            .colorDomain([0,7])
            .colorAccessor(function(d, i){return 2;})
            .xAxis().ticks(5);

    whatChart.width($('#hdx-3W-what').width()).height(250)
            .dimension(whatDimension)
            .group(whatGroup)
            .elasticX(true)
            .data(function(group) {
                return group.top(15);
            })
            .labelOffsetY(13)
            .colors(config.colors)
            .colorDomain([0,7])
            .colorAccessor(function(d, i){return 0;})
            .xAxis().ticks(5);
    
    statusChart.width($('#hdx-3W-status').width()).height(200)
            .dimension(statusDimension)
            .group(statusGroup)
            .elasticX(true)
            .data(function(group) {
                return group.top(5);
            })    
            .labelOffsetY(13)
            .colors(config.colors)
            .colorDomain([0,7])
            .colorAccessor(function(d, i){return 6;})
            .xAxis().ticks(5);    

    dc.dataCount('#count-info')
            .dimension(cf)
            .group(all);
    
     
    whereChart2.width($('#hxd-3W-where2').width()).height(100)
            .dimension(whereDimension2)
            .group(whereGroup2)
            .center([35.8, 38])
            .zoom(7)    
            .geojson(geom)
            .colors(['#CCCCCC', config.colors[0],config.colors[1], config.colors[2], config.colors[3]])
            .colorDomain([0, 1, 2, 3, 4])
            .colorAccessor(function (d) {
                if(d>10000){
                    return 4;
                } else if (d>3000) {
                    return 3;
                } else if (d>1000) {
                    return 2;
                } else if (d>1) {
                    return 1;
                }
                    else {
                    return 0;
                }
            })           
              .featureKeyAccessor(function(feature){
                return feature.properties[config.joinAttribute];
            });
    
    whereChart.width($('#hxd-3W-where').width()).height(100)
            .dimension(whereDimension)
            .group(whereGroup)
            .center([35.8, 38])
            .zoom(7)    
            .geojson(geom)
            .colors(['#CCCCCC', config.colors[4],config.colors[5], config.colors[6], config.colors[7]])
            .colorDomain([0, 1, 2, 3, 4])
            .colorAccessor(function (d) {
                if(d>4000){
                    return 4;
                } else if (d>1000) {
                    return 3;
                } else if (d>500) {
                    return 2;
                }
                else if (d>1) {
                    return 1;
                }
                    else {
                    return 0;
                }
            })           
            .featureKeyAccessor(function(feature){
                return feature.properties[config.joinAttribute];
            });
     
   
    dc.renderAll();
    
    var g = d3.selectAll('#hdx-3W-who').select('svg').append('g');
    
    g.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', $('#hdx-3W-who').width()/2)
        .attr('y', 510)
        .text('XXX1');

    var g = d3.selectAll('#hdx-3W-what').select('svg').append('g');
    
    g.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', $('#hdx-3W-what').width()/2)
        .attr('y', 250)
        .text('XXX2');

    var g = d3.selectAll('#hdx-3W-status').select('svg').append('g');

    g.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', $('#hdx-3W-status').width()/2)
        .attr('y', 160)
        .text(''); 

}

//load 3W data

var dataCall = $.ajax({ 
    type: 'GET', 
    url: config.data, 
    dataType: 'json',
});

//load geometry

var geomCall = $.ajax({ 
    type: 'GET', 
    url: config.geo, 
    dataType: 'json'
});

//when both ready construct 3W

$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){
    console.log(config.data);
    var geom = geomArgs[0];
    geom.features.forEach(function(e){
        e.properties[config.joinAttribute] = String(e.properties[config.joinAttribute]); 
    });
    console.log(dataArgs);
    generate3WComponent(config,dataArgs[0],geom);
});

