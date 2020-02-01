import React, { Component } from 'react';
import { select, selectAll } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { line, pie, arc } from 'd3-shape';
import { entries } from 'd3-collection';
import { transition } from 'd3-transition';


const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const calcCap = (val) => {
    let cap;
    if (val / 1000000000 > 1) {
        cap = 'b';
    } else if (val / 1000000 > 1) {
        cap = 'm';
    } else if (val / 1000 > 1) {
        cap = 'k';
    } else  {
        cap = 'z';
    }
    return cap;
}

const capValue = (val, cap) => {
    let res;
    switch (cap) {
        case 'b':
            res = val / 1000000000;
            break;
        case 'm':
            res = val / 1000000;
            break;
        case 'k':
            res = val / 1000;
            break;
        case 'z':
            res = val;
            break;
    }
    return res.toFixed(2);
}

const data_test = {"electricity":[{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2010,"annual_consume":1251857,"num_connections":21158.229999999996,"annual_consume_lowtarif_perc":22.46400943396226,"delivery_perc":26.287735849056602,"perc_of_active_connections":94.58518867924528},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2011,"annual_consume":1227890,"num_connections":21245.14,"annual_consume_lowtarif_perc":29.750328638497653,"delivery_perc":26.314553990610328,"perc_of_active_connections":95.21708920187793},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2012,"annual_consume":1232855,"num_connections":21519.53,"annual_consume_lowtarif_perc":29.137731481481485,"delivery_perc":26.953703703703702,"perc_of_active_connections":94.48175925925925},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2013,"annual_consume":1259301,"num_connections":21651.659999999996,"annual_consume_lowtarif_perc":30.78793577981652,"delivery_perc":26.78440366972477,"perc_of_active_connections":94.36678899082568},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2014,"annual_consume":1265363,"num_connections":21437.12,"annual_consume_lowtarif_perc":34.154954545454544,"delivery_perc":26.804545454545455,"perc_of_active_connections":92.87822727272727},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2015,"annual_consume":1238976,"num_connections":21408.96,"annual_consume_lowtarif_perc":33.8524886877828,"delivery_perc":26.764705882352942,"perc_of_active_connections":92.63990950226241},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2016,"annual_consume":1234248,"num_connections":21454.649999999998,"annual_consume_lowtarif_perc":38.986591928251116,"delivery_perc":27.04932735426009,"perc_of_active_connections":92.21282511210762},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2017,"annual_consume":1189992,"num_connections":21220.13,"annual_consume_lowtarif_perc":40.03739910313901,"delivery_perc":27.130044843049326,"perc_of_active_connections":92.0614798206278},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2018,"annual_consume":1177681,"num_connections":21095.309999999998,"annual_consume_lowtarif_perc":41.83446428571428,"delivery_perc":27.424107142857142,"perc_of_active_connections":92.0915625},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2019,"annual_consume":1253822,"num_connections":20787.67,"annual_consume_lowtarif_perc":22.70620192307692,"delivery_perc":25.990384615384617,"perc_of_active_connections":95.97899038461537},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2010,"annual_consume":1427639,"num_connections":32553.469999999998,"annual_consume_lowtarif_perc":22.446932515337426,"delivery_perc":21.279141104294478,"perc_of_active_connections":97.77748466257668},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2011,"annual_consume":1413970,"num_connections":32547.11,"annual_consume_lowtarif_perc":31.175398773006137,"delivery_perc":21.733128834355828,"perc_of_active_connections":96.91131901840488},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2012,"annual_consume":1435819,"num_connections":32934.64,"annual_consume_lowtarif_perc":31.010666666666662,"delivery_perc":21.803030303030305,"perc_of_active_connections":96.69651515151514},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2013,"annual_consume":1403262,"num_connections":32859.159999999996,"annual_consume_lowtarif_perc":32.702454545454536,"delivery_perc":22.26060606060606,"perc_of_active_connections":96.98963636363635},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2014,"annual_consume":1389696,"num_connections":32452.769999999997,"annual_consume_lowtarif_perc":38.33680722891566,"delivery_perc":22.283132530120483,"perc_of_active_connections":95.57659638554216},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2015,"annual_consume":1343783,"num_connections":32262.28999999999,"annual_consume_lowtarif_perc":38.75168674698796,"delivery_perc":22.298192771084338,"perc_of_active_connections":95.69487951807228},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2016,"annual_consume":1334733,"num_connections":31753.48999999999,"annual_consume_lowtarif_perc":43.784504504504504,"delivery_perc":22.3003003003003,"perc_of_active_connections":95.58894894894894},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2017,"annual_consume":1306546,"num_connections":31250.84999999999,"annual_consume_lowtarif_perc":47.2538622754491,"delivery_perc":22.29640718562874,"perc_of_active_connections":95.53254491017962},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2018,"annual_consume":1284266,"num_connections":30942.39,"annual_consume_lowtarif_perc":48.12417910447762,"delivery_perc":22.632835820895522,"perc_of_active_connections":95.11707462686566},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2019,"annual_consume":1405143,"num_connections":32489.4,"annual_consume_lowtarif_perc":22.816307692307692,"delivery_perc":21.166153846153847,"perc_of_active_connections":98.00043076923076},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2010,"annual_consume":1078690,"num_connections":28337.640000000003,"annual_consume_lowtarif_perc":23.07612676056338,"delivery_perc":21.482394366197184,"perc_of_active_connections":98.40570422535211},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2011,"annual_consume":1083347,"num_connections":28537.64,"annual_consume_lowtarif_perc":30.61664335664336,"delivery_perc":21.814685314685313,"perc_of_active_connections":97.4148951048951},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2012,"annual_consume":1075166,"num_connections":28632.64,"annual_consume_lowtarif_perc":30.53076655052265,"delivery_perc":21.878048780487806,"perc_of_active_connections":97.48013937282231},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2013,"annual_consume":1086610,"num_connections":28831.18,"annual_consume_lowtarif_perc":31.125931034482754,"delivery_perc":21.924137931034483,"perc_of_active_connections":97.34610344827585},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2014,"annual_consume":1044567,"num_connections":27994.569999999996,"annual_consume_lowtarif_perc":33.35275261324042,"delivery_perc":21.916376306620208,"perc_of_active_connections":96.26282229965157},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2015,"annual_consume":1034477,"num_connections":28135.85,"annual_consume_lowtarif_perc":34.402448275862064,"delivery_perc":21.858620689655172,"perc_of_active_connections":96.27796551724138},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2016,"annual_consume":1021226,"num_connections":27347.189999999995,"annual_consume_lowtarif_perc":44.139106529209606,"delivery_perc":22.16151202749141,"perc_of_active_connections":96.49938144329897},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2017,"annual_consume":993916,"num_connections":26748.989999999994,"annual_consume_lowtarif_perc":45.44383561643834,"delivery_perc":22.328767123287673,"perc_of_active_connections":96.62140410958904},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2018,"annual_consume":958197,"num_connections":26183.159999999996,"annual_consume_lowtarif_perc":47.68276450511945,"delivery_perc":22.37542662116041,"perc_of_active_connections":96.64068259385665},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2019,"annual_consume":1091518,"num_connections":28264.510000000002,"annual_consume_lowtarif_perc":23.182685512367495,"delivery_perc":21.501766784452297,"perc_of_active_connections":98.11356890459363},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2010,"annual_consume":176459,"num_connections":4286.48,"annual_consume_lowtarif_perc":22.41911111111111,"delivery_perc":29.266666666666666,"perc_of_active_connections":93.77688888888889},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2011,"annual_consume":178092,"num_connections":4282.719999999999,"annual_consume_lowtarif_perc":33.65755555555556,"delivery_perc":29.733333333333334,"perc_of_active_connections":93.98222222222223},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2012,"annual_consume":217149,"num_connections":5049.459999999999,"annual_consume_lowtarif_perc":29.01622641509434,"delivery_perc":29.11320754716981,"perc_of_active_connections":90.63301886792452},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2013,"annual_consume":263541,"num_connections":5191.459999999999,"annual_consume_lowtarif_perc":34.75272727272727,
"delivery_perc":29.89090909090909,"perc_of_active_connections":91.984},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2014,"annual_consume":274912,"num_connections":4965.66,"annual_consume_lowtarif_perc":42.063508771929826,"delivery_perc":31.24561403508772,"perc_of_active_connections":84.9717543859649},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2015,"annual_consume":318158,"num_connections":5169.949999999999,"annual_consume_lowtarif_perc":45.580000000000005,"delivery_perc":31.066666666666666,"perc_of_active_connections":83.00799999999998},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2016,"annual_consume":314415,"num_connections":5092.099999999999,"annual_consume_lowtarif_perc":84.55649999999999,"delivery_perc":32.03333333333333,"perc_of_active_connections":86.52483333333332},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2017,"annual_consume":334828,"num_connections":5404.56,"annual_consume_lowtarif_perc":85.0996923076923,"delivery_perc":32,"perc_of_active_connections":84.62353846153844},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2018,"annual_consume":337136,"num_connections":5555.610000000001,"annual_consume_lowtarif_perc":85.54279411764705,"delivery_perc":32.029411764705884,"perc_of_active_connections":85.20397058823528},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2019,"annual_consume":175892,"num_connections":4219.29,"annual_consume_lowtarif_perc":22.802272727272733,"delivery_perc":28.5,"perc_of_active_connections":93.86068181818182},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2010,"annual_consume":10547,"num_connections":200,"annual_consume_lowtarif_perc":30.939999999999998,"delivery_perc":21,"perc_of_active_connections":95},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2011,"annual_consume":11759,"num_connections":200,"annual_consume_lowtarif_perc":36.46,"delivery_perc":22,"perc_of_active_connections":95.83500000000001},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2012,"annual_consume":10093,"num_connections":200,"annual_consume_lowtarif_perc":38.7,"delivery_perc":22.5,"perc_of_active_connections":96.155},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2013,"annual_consume":11088,"num_connections":200,"annual_consume_lowtarif_perc":42.55,"delivery_perc":22.5,"perc_of_active_connections":96.155},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2014,"annual_consume":9966,"num_connections":200,"annual_consume_lowtarif_perc":35.625,"delivery_perc":21,"perc_of_active_connections":95},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2015,"annual_consume":29739,"num_connections":400,"annual_consume_lowtarif_perc":62.394999999999996,"delivery_perc":23.5,"perc_of_active_connections":49.582499999999996},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2016,"annual_consume":48077,"num_connections":626.15,"annual_consume_lowtarif_perc":73.53142857142858,"delivery_perc":23.285714285714285,"perc_of_active_connections":88.78714285714285},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2017,"annual_consume":65218,"num_connections":872.6800000000001,"annual_consume_lowtarif_perc":67.92454545454547,"delivery_perc":27.90909090909091,"perc_of_active_connections":86.81727272727272},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2018,"annual_consume":77696,"num_connections":860.6800000000001,"annual_consume_lowtarif_perc":63.701666666666675,"delivery_perc":28.833333333333332,"perc_of_active_connections":75.69500000000001},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2019,"annual_consume":11826,"num_connections":200,"annual_consume_lowtarif_perc":27.085,"delivery_perc":28,"perc_of_active_connections":97.91499999999999},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2010,"annual_consume":689532,"num_connections":16790.06,"annual_consume_lowtarif_perc":17.1675,"delivery_perc":23.970238095238095,"perc_of_active_connections":89.4995238095238},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2011,"annual_consume":696752,"num_connections":16774.28,"annual_consume_lowtarif_perc":24.96630952380953,"delivery_perc":24.648809523809526,"perc_of_active_connections":86.43982142857142},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2012,"annual_consume":735520,"num_connections":17281.1,"annual_consume_lowtarif_perc":24.12988439306358,"delivery_perc":25.046242774566473,"perc_of_active_connections":85.6735260115607},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2013,"annual_consume":771709,"num_connections":17596.12,"annual_consume_lowtarif_perc":27.79740112994351,"delivery_perc":25.451977401129945,"perc_of_active_connections":86.61745762711864},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2014,"annual_consume":839792,"num_connections":17701.09,"annual_consume_lowtarif_perc":31.838729281767954,"delivery_perc":25.734806629834253,"perc_of_active_connections":84.85519337016574},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2015,"annual_consume":768925,"num_connections":17789.96,"annual_consume_lowtarif_perc":33.939945355191256,"delivery_perc":26.524590163934427,"perc_of_active_connections":85.62174863387978},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2016,"annual_consume":757247,"num_connections":17799.96,"annual_consume_lowtarif_perc":36.63551351351351,"delivery_perc":27.14054054054054,"perc_of_active_connections":85.87113513513512},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2017,"annual_consume":760192,"num_connections":17888.619999999995,"annual_consume_lowtarif_perc":38.775691489361705,"delivery_perc":27.595744680851062,"perc_of_active_connections":86.4120744680851},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2018,"annual_consume":806164,"num_connections":18487.31,"annual_consume_lowtarif_perc":40.50760204081632,"delivery_perc":27.816326530612244,"perc_of_active_connections":85.4019387755102},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2019,"annual_consume":705649,"num_connections":16593.18,"annual_consume_lowtarif_perc":17.627289156626507,"delivery_perc":23.427710843373493,"perc_of_active_connections":90.65813253012048},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2010,"annual_consume":421051,"num_connections":10600,"annual_consume_lowtarif_perc":23.002924528301886,"delivery_perc":26.69811320754717,"perc_of_active_connections":99.66396226415095},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2011,"annual_consume":414852,"num_connections":10600,"annual_consume_lowtarif_perc":32.33405660377358,"delivery_perc":26.69811320754717,"perc_of_active_connections":99.75198113207546},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2012,"annual_consume":415274,"num_connections":10592.86,"annual_consume_lowtarif_perc":32.31669811320754,"delivery_perc":26.79245283018868,"perc_of_active_connections":99.48641509433962},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2013,"annual_consume":399643,"num_connections":10555.689999999999,"annual_consume_lowtarif_perc":32.260471698113214,"delivery_perc":26.89622641509434,"perc_of_active_connections":99.49047169811321},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2014,"annual_consume":395264,"num_connections":10486.98,"annual_consume_lowtarif_perc":39.92532710280375,"delivery_perc":26.588785046728972,"perc_of_active_connections":98.82439252336448},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2015,"annual_consume":392146,"num_connections":10374.96,"annual_consume_lowtarif_perc":40.397850467289715,"delivery_perc":26.598130841121495,"perc_of_active_connections":98.73682242990654},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2016,"annual_consume":378349,"num_connections":10242.7,"annual_consume_lowtarif_perc":43.39598130841121,"delivery_perc":26.598130841121495,"perc_of_active_connections":98.70934579439252},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2017,"annual_consume":361418,"num_connections":9863.700000000003,"annual_consume_lowtarif_perc":45.06896226415094,"delivery_perc":26.32075471698113,"perc_of_active_connections":98.76566037735849},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2018,"annual_consume":351795,"num_connections":9837.13,"annual_consume_lowtarif_perc":45.48065420560747,"delivery_perc":26.61682242990654,"perc_of_active_connections":98.53859813084111},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811",
"wijknaam2019":"Maandereng","year":2019,"annual_consume":418650,"num_connections":10600,"annual_consume_lowtarif_perc":23.249811320754716,"delivery_perc":26.632075471698112,"perc_of_active_connections":99.75943396226415},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2010,"annual_consume":587485,"num_connections":13096,"annual_consume_lowtarif_perc":30.37160305343511,"delivery_perc":24.908396946564885,"perc_of_active_connections":99.08312977099236},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2011,"annual_consume":589702,"num_connections":13192.43,"annual_consume_lowtarif_perc":58.807651515151505,"delivery_perc":24.954545454545453,"perc_of_active_connections":98.99515151515152},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2012,"annual_consume":594309,"num_connections":13192.58,"annual_consume_lowtarif_perc":58.53272727272727,"delivery_perc":25.060606060606062,"perc_of_active_connections":99.31015151515152},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2013,"annual_consume":579028,"num_connections":13262.369999999999,"annual_consume_lowtarif_perc":58.83736842105264,"delivery_perc":24.93984962406015,"perc_of_active_connections":99.35804511278197},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2014,"annual_consume":572232,"num_connections":13023.39,"annual_consume_lowtarif_perc":60.24263157894737,"delivery_perc":25.022556390977442,"perc_of_active_connections":98.41240601503759},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2015,"annual_consume":559129,"num_connections":12876.52,"annual_consume_lowtarif_perc":60.46503759398497,"delivery_perc":25.05263157894737,"perc_of_active_connections":98.30300751879699},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2016,"annual_consume":541712,"num_connections":12687.16,"annual_consume_lowtarif_perc":61.60360902255641,"delivery_perc":25.06766917293233,"perc_of_active_connections":98.26541353383456},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2017,"annual_consume":525131,"num_connections":12310.53,"annual_consume_lowtarif_perc":63.09150375939851,"delivery_perc":25.097744360902254,"perc_of_active_connections":98.20150375939849},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2018,"annual_consume":510497,"num_connections":12035.949999999999,"annual_consume_lowtarif_perc":63.85406015037594,"delivery_perc":25.112781954887218,"perc_of_active_connections":98.14180451127817},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2019,"annual_consume":571221,"num_connections":13100,"annual_consume_lowtarif_perc":30.558167938931298,"delivery_perc":24.85496183206107,"perc_of_active_connections":99.16824427480917},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2010,"annual_consume":472864,"num_connections":2497.44,"annual_consume_lowtarif_perc":25.5592,"delivery_perc":26.48,"perc_of_active_connections":78.67599999999999},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2011,"annual_consume":491655,"num_connections":2600,"annual_consume_lowtarif_perc":36.52038461538461,"delivery_perc":26.846153846153847,"perc_of_active_connections":78.10499999999999},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2012,"annual_consume":483065,"num_connections":2695.24,"annual_consume_lowtarif_perc":32.19,"delivery_perc":25.185185185185187,"perc_of_active_connections":77.33962962962963},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2013,"annual_consume":474950,"num_connections":2894.44,"annual_consume_lowtarif_perc":39.10137931034483,"delivery_perc":27.24137931034483,"perc_of_active_connections":77.60068965517242},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2014,"annual_consume":485549,"num_connections":2938.12,"annual_consume_lowtarif_perc":41.106666666666676,"delivery_perc":26.033333333333335,"perc_of_active_connections":76.09333333333333},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2015,"annual_consume":503938,"num_connections":3037.55,"annual_consume_lowtarif_perc":41.840322580645164,"delivery_perc":25.677419354838708,"perc_of_active_connections":73.95838709677419},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2016,"annual_consume":540662,"num_connections":3222.3999999999996,"annual_consume_lowtarif_perc":42.69333333333332,"delivery_perc":24.939393939393938,"perc_of_active_connections":72.03000000000002},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2017,"annual_consume":514889,"num_connections":3201.79,"annual_consume_lowtarif_perc":44.6139393939394,"delivery_perc":25.151515151515152,"perc_of_active_connections":71.62060606060606},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2018,"annual_consume":509128,"num_connections":3193.7200000000007,"annual_consume_lowtarif_perc":49.1790909090909,"delivery_perc":26.545454545454547,"perc_of_active_connections":71.60060606060605},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2019,"annual_consume":472005,"num_connections":2397.37,"annual_consume_lowtarif_perc":27.94916666666667,"delivery_perc":26.208333333333332,"perc_of_active_connections":80.97208333333333},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2010,"annual_consume":508461,"num_connections":4681.57,"annual_consume_lowtarif_perc":49.03170212765957,"delivery_perc":24.382978723404257,"perc_of_active_connections":90.30893617021277},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2011,"annual_consume":555668,"num_connections":4977.87,"annual_consume_lowtarif_perc":54.9124,"delivery_perc":23.04,"perc_of_active_connections":88.93960000000001},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2012,"annual_consume":530553,"num_connections":4970.28,"annual_consume_lowtarif_perc":54.0402,"delivery_perc":22.84,"perc_of_active_connections":87.0724},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2013,"annual_consume":541912,"num_connections":5151.56,"annual_consume_lowtarif_perc":57.075961538461534,"delivery_perc":22.576923076923077,"perc_of_active_connections":87.76461538461538},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2014,"annual_consume":538025,"num_connections":5117.13,"annual_consume_lowtarif_perc":56.574150943396226,"delivery_perc":22.264150943396228,"perc_of_active_connections":85.44716981132075},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2015,"annual_consume":509437,"num_connections":4929.51,"annual_consume_lowtarif_perc":56.35461538461539,"delivery_perc":22.807692307692307,"perc_of_active_connections":84.91230769230768},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2016,"annual_consume":527674,"num_connections":5069.41,"annual_consume_lowtarif_perc":63.10740740740741,"delivery_perc":22.944444444444443,"perc_of_active_connections":84.41277777777776},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2017,"annual_consume":508748,"num_connections":5027.79,"annual_consume_lowtarif_perc":62.974629629629625,"delivery_perc":22.537037037037038,"perc_of_active_connections":84.09185185185186},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2018,"annual_consume":505400,"num_connections":4929.31,"annual_consume_lowtarif_perc":64.48314814814815,"delivery_perc":22.814814814814813,"perc_of_active_connections":83.36851851851851},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2019,"annual_consume":485230,"num_connections":4500,"annual_consume_lowtarif_perc":49.476444444444446,"delivery_perc":24.2,"perc_of_active_connections":91.53711111111112},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2010,"annual_consume":1688249,"num_connections":28968.949999999997,"annual_consume_lowtarif_perc":29.422931034482758,"delivery_perc":23.306896551724137,"perc_of_active_connections":96.10324137931033},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2011,"annual_consume":1687343,"num_connections":28858.76,"annual_consume_lowtarif_perc":36.455501730103805,"delivery_perc":23.72318339100346,"perc_of_active_connections":95.63076124567475},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2012,"annual_consume":1693188,"num_connections":29325.970000000005,"annual_consume_lowtarif_perc":36.143571428571434,"delivery_perc":23.74829931972789,"perc_of_active_connections":94.57085034013606},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2013,"annual_consume":1716172,
"num_connections":29434.23999999999,"annual_consume_lowtarif_perc":37.83466442953021,"delivery_perc":24.107382550335572,"perc_of_active_connections":94.26939597315436},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2014,"annual_consume":1689214,"num_connections":28418.75,"annual_consume_lowtarif_perc":38.99478260869565,"delivery_perc":24.351170568561873,"perc_of_active_connections":92.01501672240802},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2015,"annual_consume":1633753,"num_connections":27975.549999999996,"annual_consume_lowtarif_perc":40.21636666666668,"delivery_perc":24.663333333333334,"perc_of_active_connections":91.7499},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2016,"annual_consume":1628408,"num_connections":27523.760000000002,"annual_consume_lowtarif_perc":43.105733333333326,"delivery_perc":24.916666666666668,"perc_of_active_connections":91.45236666666663},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2017,"annual_consume":1598054,"num_connections":27233.47,"annual_consume_lowtarif_perc":49.095049504950495,"delivery_perc":25.016501650165015,"perc_of_active_connections":91.38353135313531},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2018,"annual_consume":1539510,"num_connections":26803.829999999994,"annual_consume_lowtarif_perc":52.34993421052632,"delivery_perc":25.05263157894737,"perc_of_active_connections":91.2499342105263},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2019,"annual_consume":1692002,"num_connections":29000,"annual_consume_lowtarif_perc":29.29772413793104,"delivery_perc":23.193103448275863,"perc_of_active_connections":96.46082758620689},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2010,"annual_consume":2426362,"num_connections":27089.08,"annual_consume_lowtarif_perc":37.7877859778598,"delivery_perc":23.52029520295203,"perc_of_active_connections":94.45785977859776},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2011,"annual_consume":2464873,"num_connections":27278.25,"annual_consume_lowtarif_perc":46.49435897435898,"delivery_perc":23.824175824175825,"perc_of_active_connections":93.5833333333333},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2012,"annual_consume":2538731,"num_connections":27645.53,"annual_consume_lowtarif_perc":46.223610108303255,"delivery_perc":24.76534296028881,"perc_of_active_connections":93.36480144404332},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2013,"annual_consume":2442538,"num_connections":27554.410000000003,"annual_consume_lowtarif_perc":46.82169064748202,"delivery_perc":25.118705035971225,"perc_of_active_connections":92.37348920863307},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2014,"annual_consume":2539435,"num_connections":27507.08,"annual_consume_lowtarif_perc":49.09814035087721,"delivery_perc":25.16140350877193,"perc_of_active_connections":90.10761403508766},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2015,"annual_consume":2435615,"num_connections":27550.7,"annual_consume_lowtarif_perc":50.109407665505245,"delivery_perc":25.637630662020907,"perc_of_active_connections":89.9447038327526},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2016,"annual_consume":2365895,"num_connections":27396.379999999994,"annual_consume_lowtarif_perc":52.329722222222216,"delivery_perc":26.024305555555557,"perc_of_active_connections":89.35850694444441},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2017,"annual_consume":2330717,"num_connections":27089.09,"annual_consume_lowtarif_perc":53.57314878892734,"delivery_perc":26.17993079584775,"perc_of_active_connections":89.19916955017301},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2018,"annual_consume":2313979,"num_connections":26817.52999999999,"annual_consume_lowtarif_perc":57.52178694158076,"delivery_perc":26.45360824742268,"perc_of_active_connections":88.79034364261167},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2019,"annual_consume":2314695,"num_connections":26995,"annual_consume_lowtarif_perc":38.07240740740742,"delivery_perc":23.296296296296298,"perc_of_active_connections":94.9537037037037},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2010,"annual_consume":507800,"num_connections":6700,"annual_consume_lowtarif_perc":39.13701492537314,"delivery_perc":21.686567164179106,"perc_of_active_connections":95.45328358208957},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2011,"annual_consume":523537,"num_connections":6700,"annual_consume_lowtarif_perc":45.65776119402985,"delivery_perc":21.80597014925373,"perc_of_active_connections":95.35611940298506},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2012,"annual_consume":529148,"num_connections":6695.84,"annual_consume_lowtarif_perc":44.734626865671636,"delivery_perc":21.955223880597014,"perc_of_active_connections":95.21477611940297},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2013,"annual_consume":509092,"num_connections":6674.639999999999,"annual_consume_lowtarif_perc":45.31223880597015,"delivery_perc":22.28358208955224,"perc_of_active_connections":94.91507462686566},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2014,"annual_consume":501888,"num_connections":6535.2300000000005,"annual_consume_lowtarif_perc":48.69492537313433,"delivery_perc":22.80597014925373,"perc_of_active_connections":93.1810447761194},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2015,"annual_consume":475017,"num_connections":6522.500000000001,"annual_consume_lowtarif_perc":49.603134328358216,"delivery_perc":23.029850746268657,"perc_of_active_connections":93.28432835820894},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2016,"annual_consume":483714,"num_connections":6670.1500000000015,"annual_consume_lowtarif_perc":50.7036231884058,"delivery_perc":22.507246376811594,"perc_of_active_connections":93.1723188405797},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2017,"annual_consume":478010,"num_connections":6683.170000000001,"annual_consume_lowtarif_perc":52.345714285714294,"delivery_perc":22.942857142857143,"perc_of_active_connections":92.51857142857142},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2018,"annual_consume":469710,"num_connections":6574.64,"annual_consume_lowtarif_perc":55.495285714285714,"delivery_perc":23.385714285714286,"perc_of_active_connections":92.52342857142857},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2019,"annual_consume":506745,"num_connections":6600,"annual_consume_lowtarif_perc":40.55560606060606,"delivery_perc":21.106060606060606,"perc_of_active_connections":95.35121212121213},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2010,"annual_consume":101881,"num_connections":900,"annual_consume_lowtarif_perc":45.364444444444445,"delivery_perc":25.555555555555557,"perc_of_active_connections":91.82666666666667},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2011,"annual_consume":95502,"num_connections":897.14,"annual_consume_lowtarif_perc":48.16111111111112,"delivery_perc":25.88888888888889,"perc_of_active_connections":85.5011111111111},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2012,"annual_consume":92111,"num_connections":897.14,"annual_consume_lowtarif_perc":47.31111111111112,"delivery_perc":25.77777777777778,"perc_of_active_connections":85.52222222222221},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2013,"annual_consume":91086,"num_connections":897.6700000000001,"annual_consume_lowtarif_perc":50.83888888888889,"delivery_perc":27.22222222222222,"perc_of_active_connections":83.00666666666666},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2014,"annual_consume":93980,"num_connections":883.18,"annual_consume_lowtarif_perc":52.696666666666665,"delivery_perc":27.666666666666668,"perc_of_active_connections":82.1711111111111},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2015,"annual_consume":90263,"num_connections":869.68,"annual_consume_lowtarif_perc":53.104444444444454,"delivery_perc":27.77777777777778,"perc_of_active_connections":80.80666666666667},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2016,"annual_consume":91221,"num_connections":867.72,"annual_consume_lowtarif_perc":56.0888888888889,"delivery_perc":28.333333333333332,"perc_of_active_connections":79.35888888888888},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2017,"annual_consume":87218,"num_connections":863.12,"annual_consume_lowtarif_perc":57.294444444444444,"delivery_perc":28.333333333333332,"perc_of_active_connections":79.35888888888888},
{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2018,"annual_consume":82255,"num_connections":844.62,"annual_consume_lowtarif_perc":62.61222222222222,"delivery_perc":28.666666666666668,"perc_of_active_connections":78.68},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2019,"annual_consume":102607,"num_connections":900,"annual_consume_lowtarif_perc":44.354444444444454,"delivery_perc":25.555555555555557,"perc_of_active_connections":92.32111111111111},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2010,"annual_consume":624202,"num_connections":6100,"annual_consume_lowtarif_perc":43.43196721311475,"delivery_perc":21.770491803278688,"perc_of_active_connections":95.84442622950819},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2011,"annual_consume":629899,"num_connections":6085.18,"annual_consume_lowtarif_perc":48.09180327868852,"delivery_perc":21.983606557377048,"perc_of_active_connections":95.14737704918032},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2012,"annual_consume":619796,"num_connections":6085.18,"annual_consume_lowtarif_perc":47.91508196721311,"delivery_perc":22.098360655737704,"perc_of_active_connections":95.51786885245902},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2013,"annual_consume":615206,"num_connections":6070.69,"annual_consume_lowtarif_perc":49.37360655737705,"delivery_perc":22.459016393442624,"perc_of_active_connections":95.09426229508195},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2014,"annual_consume":622393,"num_connections":5956.869999999999,"annual_consume_lowtarif_perc":50.21000000000002,"delivery_perc":22.612903225806452,"perc_of_active_connections":92.62080645161289},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2015,"annual_consume":614472,"num_connections":6126.860000000001,"annual_consume_lowtarif_perc":52.270468750000006,"delivery_perc":22.453125,"perc_of_active_connections":92.95750000000001},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2016,"annual_consume":616755,"num_connections":6087.289999999999,"annual_consume_lowtarif_perc":53.069218750000005,"delivery_perc":22.546875,"perc_of_active_connections":92.77453125},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2017,"annual_consume":613609,"num_connections":6248.03,"annual_consume_lowtarif_perc":56.1159090909091,"delivery_perc":22.348484848484848,"perc_of_active_connections":92.65090909090908},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2018,"annual_consume":613685,"num_connections":6292.59,"annual_consume_lowtarif_perc":60.554626865671636,"delivery_perc":22.134328358208954,"perc_of_active_connections":92.74402985074624},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2019,"annual_consume":632484,"num_connections":6000,"annual_consume_lowtarif_perc":45.27716666666665,"delivery_perc":21.716666666666665,"perc_of_active_connections":96.388},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2010,"annual_consume":384460,"num_connections":4400,"annual_consume_lowtarif_perc":39.25409090909091,"delivery_perc":20.59090909090909,"perc_of_active_connections":96.10000000000001},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2011,"annual_consume":384381,"num_connections":4400,"annual_consume_lowtarif_perc":47.09363636363635,"delivery_perc":20.84090909090909,"perc_of_active_connections":95.90295454545456},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2012,"annual_consume":373039,"num_connections":4400,"annual_consume_lowtarif_perc":45.99090909090909,"delivery_perc":21.113636363636363,"perc_of_active_connections":94.77},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2013,"annual_consume":372899,"num_connections":4392.799999999999,"annual_consume_lowtarif_perc":47.86431818181818,"delivery_perc":21.704545454545453,"perc_of_active_connections":94.24295454545455},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2014,"annual_consume":378717,"num_connections":4184.13,"annual_consume_lowtarif_perc":52.49046511627906,"delivery_perc":23.558139534883722,"perc_of_active_connections":91.63023255813953},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2015,"annual_consume":360161,"num_connections":4350.91,"annual_consume_lowtarif_perc":54.82955555555555,"delivery_perc":23.622222222222224,"perc_of_active_connections":91.31955555555558},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2016,"annual_consume":350864,"num_connections":4206.35,"annual_consume_lowtarif_perc":57.66755555555555,"delivery_perc":23.955555555555556,"perc_of_active_connections":90.42888888888889},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2017,"annual_consume":357669,"num_connections":4431.9400000000005,"annual_consume_lowtarif_perc":62.60583333333333,"delivery_perc":24.0625,"perc_of_active_connections":89.77729166666666},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2018,"annual_consume":364796,"num_connections":4416.369999999999,"annual_consume_lowtarif_perc":67.92265306122447,"delivery_perc":24.448979591836736,"perc_of_active_connections":87.15551020408164},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2019,"annual_consume":350199,"num_connections":4000,"annual_consume_lowtarif_perc":40.10274999999999,"delivery_perc":20.825,"perc_of_active_connections":95.77174999999998},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2010,"annual_consume":453092,"num_connections":4897.67,"annual_consume_lowtarif_perc":41.29999999999999,"delivery_perc":23.755102040816325,"perc_of_active_connections":95.55510204081632},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2011,"annual_consume":445898,"num_connections":4886.66,"annual_consume_lowtarif_perc":48.42265306122449,"delivery_perc":24.183673469387756,"perc_of_active_connections":95.21428571428571},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2012,"annual_consume":467889,"num_connections":5080.780000000001,"annual_consume_lowtarif_perc":46.96607843137255,"delivery_perc":23.568627450980394,"perc_of_active_connections":93.54470588235294},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2013,"annual_consume":447856,"num_connections":5080.99,"annual_consume_lowtarif_perc":47.74372549019608,"delivery_perc":23.705882352941178,"perc_of_active_connections":93.4250980392157},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2014,"annual_consume":448942,"num_connections":4902.78,"annual_consume_lowtarif_perc":49.362199999999994,"delivery_perc":24.04,"perc_of_active_connections":92.0574},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2015,"annual_consume":434150,"num_connections":4968.799999999999,"annual_consume_lowtarif_perc":50.43627450980392,"delivery_perc":23.58823529411765,"perc_of_active_connections":90.70823529411764},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2016,"annual_consume":422436,"num_connections":4883.879999999999,"annual_consume_lowtarif_perc":52.28098039215686,"delivery_perc":23.80392156862745,"perc_of_active_connections":91.17764705882352},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2017,"annual_consume":429320,"num_connections":5025.65,"annual_consume_lowtarif_perc":54.56528301886792,"delivery_perc":23.09433962264151,"perc_of_active_connections":91.02830188679243},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2018,"annual_consume":420854,"num_connections":5020.709999999999,"annual_consume_lowtarif_perc":58.697407407407404,"delivery_perc":23.055555555555557,"perc_of_active_connections":90.84000000000002},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2019,"annual_consume":458002,"num_connections":4897.67,"annual_consume_lowtarif_perc":41.32673469387755,"delivery_perc":23.46938775510204,"perc_of_active_connections":96.42244897959183}],"gas":[{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2010,"annual_consume":498234,"num_connections":20200,"annual_consume_lowtarif_perc":0,"delivery_perc":24.633663366336634,"perc_of_active_connections":97.82623762376238},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2011,"annual_consume":495060,"num_connections":20400,"annual_consume_lowtarif_perc":0,"delivery_perc":24.563725490196077,"perc_of_active_connections":98.67588235294119},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2012,"annual_consume":486544,"num_connections":20400,"annual_consume_lowtarif_perc":0,"delivery_perc":24.715686274509803,"perc_of_active_connections":98.3272549019608},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801",
"wijknaam2019":"Ede-Oost","year":2013,"annual_consume":467523,"num_connections":20400,"annual_consume_lowtarif_perc":0,"delivery_perc":24.813725490196077,"perc_of_active_connections":97.97607843137256},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2014,"annual_consume":463671,"num_connections":20600,"annual_consume_lowtarif_perc":0,"delivery_perc":24.820388349514563,"perc_of_active_connections":97.42961165048544},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2015,"annual_consume":943611,"num_connections":40600,"annual_consume_lowtarif_perc":0,"delivery_perc":24.559113300492612,"perc_of_active_connections":98.00694581280786},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2016,"annual_consume":443965,"num_connections":20700,"annual_consume_lowtarif_perc":0,"delivery_perc":25.183574879227052,"perc_of_active_connections":97.00318840579712},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2017,"annual_consume":438243,"num_connections":20900,"annual_consume_lowtarif_perc":0,"delivery_perc":25.095693779904305,"perc_of_active_connections":96.72727272727273},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2018,"annual_consume":439824,"num_connections":21000,"annual_consume_lowtarif_perc":0,"delivery_perc":24.97142857142857,"perc_of_active_connections":97.02242857142859},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22801","wijknaam2019":"Ede-Oost","year":2019,"annual_consume":437157,"num_connections":21200,"annual_consume_lowtarif_perc":0,"delivery_perc":25.056603773584907,"perc_of_active_connections":96.71080188679247},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2010,"annual_consume":617588,"num_connections":30900,"annual_consume_lowtarif_perc":0,"delivery_perc":21.02588996763754,"perc_of_active_connections":99.56006472491909},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2011,"annual_consume":608960,"num_connections":31000,"annual_consume_lowtarif_perc":0,"delivery_perc":21.38064516129032,"perc_of_active_connections":98.58632258064517},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2012,"annual_consume":607730,"num_connections":31500,"annual_consume_lowtarif_perc":0,"delivery_perc":21.33015873015873,"perc_of_active_connections":98.43301587301588},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2013,"annual_consume":578901,"num_connections":31500,"annual_consume_lowtarif_perc":0,"delivery_perc":21.736507936507937,"perc_of_active_connections":98.9910476190476},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2014,"annual_consume":571426,"num_connections":31600,"annual_consume_lowtarif_perc":0,"delivery_perc":21.753164556962027,"perc_of_active_connections":98.70607594936709},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2015,"annual_consume":1169487,"num_connections":62500,"annual_consume_lowtarif_perc":0,"delivery_perc":21.3472,"perc_of_active_connections":99.187504},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2016,"annual_consume":544612,"num_connections":31700,"annual_consume_lowtarif_perc":0,"delivery_perc":21.769716088328074,"perc_of_active_connections":98.80085173501577},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2017,"annual_consume":533713,"num_connections":31600,"annual_consume_lowtarif_perc":0,"delivery_perc":21.74367088607595,"perc_of_active_connections":98.84193037974683},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2018,"annual_consume":537933,"num_connections":31700,"annual_consume_lowtarif_perc":0,"delivery_perc":21.974763406940063,"perc_of_active_connections":98.64627760252364},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22802","wijknaam2019":"Ede-West","year":2019,"annual_consume":529934,"num_connections":31700,"annual_consume_lowtarif_perc":0,"delivery_perc":22.028391167192428,"perc_of_active_connections":97.9393690851735},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2010,"annual_consume":368489,"num_connections":25100,"annual_consume_lowtarif_perc":0,"delivery_perc":20.673306772908365,"perc_of_active_connections":98.47589641434261},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2011,"annual_consume":362343,"num_connections":25300,"annual_consume_lowtarif_perc":0,"delivery_perc":21.118577075098813,"perc_of_active_connections":97.46652173913043},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2012,"annual_consume":350922,"num_connections":25300,"annual_consume_lowtarif_perc":0,"delivery_perc":21.205533596837945,"perc_of_active_connections":97.88466403162055},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2013,"annual_consume":342997,"num_connections":25500,"annual_consume_lowtarif_perc":0,"delivery_perc":21.137254901960784,"perc_of_active_connections":97.84776470588235},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2014,"annual_consume":337118,"num_connections":25500,"annual_consume_lowtarif_perc":0,"delivery_perc":21.16862745098039,"perc_of_active_connections":97.71525490196078},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2015,"annual_consume":702523,"num_connections":50900,"annual_consume_lowtarif_perc":0,"delivery_perc":20.852652259332025,"perc_of_active_connections":97.93813359528488},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2016,"annual_consume":326112,"num_connections":25900,"annual_consume_lowtarif_perc":0,"delivery_perc":21.158301158301157,"perc_of_active_connections":97.71200772200774},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2017,"annual_consume":333769,"num_connections":26000,"annual_consume_lowtarif_perc":0,"delivery_perc":21.173076923076923,"perc_of_active_connections":97.41407692307692},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2018,"annual_consume":332982,"num_connections":26000,"annual_consume_lowtarif_perc":0,"delivery_perc":21.173076923076923,"perc_of_active_connections":97.55223076923077},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22803","wijknaam2019":"Ede-Veldhuizen","year":2019,"annual_consume":320058,"num_connections":25900,"annual_consume_lowtarif_perc":0,"delivery_perc":21.25868725868726,"perc_of_active_connections":97.50965250965251},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2010,"annual_consume":4040,"num_connections":100,"annual_consume_lowtarif_perc":0,"delivery_perc":28,"perc_of_active_connections":100},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2011,"annual_consume":3981,"num_connections":100,"annual_consume_lowtarif_perc":0,"delivery_perc":28,"perc_of_active_connections":100},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2012,"annual_consume":3928,"num_connections":100,"annual_consume_lowtarif_perc":0,"delivery_perc":28,"perc_of_active_connections":100},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2013,"annual_consume":3931,"num_connections":100,"annual_consume_lowtarif_perc":0,"delivery_perc":28,"perc_of_active_connections":100},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2014,"annual_consume":3929,"num_connections":100,"annual_consume_lowtarif_perc":0,"delivery_perc":28,"perc_of_active_connections":100},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2015,"annual_consume":9420,"num_connections":300,"annual_consume_lowtarif_perc":0,"delivery_perc":25.666666666666668,"perc_of_active_connections":57.223333333333336},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2016,"annual_consume":10348,"num_connections":500,"annual_consume_lowtarif_perc":0,"delivery_perc":25.4,"perc_of_active_connections":97.51599999999999},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2017,"annual_consume":5776,"num_connections":500,"annual_consume_lowtarif_perc":0,"delivery_perc":25.4,"perc_of_active_connections":97.51599999999999},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2018,"annual_consume":12095,"num_connections":900,"annual_consume_lowtarif_perc":0,"delivery_perc":23.666666666666668,"perc_of_active_connections":81.33666666666666},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22804","wijknaam2019":"Kernhem","year":2019,"annual_consume":12771,"num_connections":1000,"annual_consume_lowtarif_perc":0,"delivery_perc":24.1,"perc_of_active_connections":95.414},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2010,"annual_consume":10812,"num_connections":200,"annual_consume_lowtarif_perc":0,"delivery_perc":20,"perc_of_active_connections":100},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2011,
"annual_consume":9142,"num_connections":200,"annual_consume_lowtarif_perc":0,"delivery_perc":20,"perc_of_active_connections":100},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2012,"annual_consume":9188,"num_connections":200,"annual_consume_lowtarif_perc":0,"delivery_perc":20,"perc_of_active_connections":100},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2013,"annual_consume":8838,"num_connections":200,"annual_consume_lowtarif_perc":0,"delivery_perc":20,"perc_of_active_connections":100},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2014,"annual_consume":8842,"num_connections":200,"annual_consume_lowtarif_perc":0,"delivery_perc":20,"perc_of_active_connections":100},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2015,"annual_consume":21805,"num_connections":500,"annual_consume_lowtarif_perc":0,"delivery_perc":20.8,"perc_of_active_connections":78},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2016,"annual_consume":14553,"num_connections":600,"annual_consume_lowtarif_perc":0,"delivery_perc":26,"perc_of_active_connections":96.36666666666667},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2017,"annual_consume":18306,"num_connections":900,"annual_consume_lowtarif_perc":0,"delivery_perc":26.555555555555557,"perc_of_active_connections":97.74333333333333},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2018,"annual_consume":23293,"num_connections":1100,"annual_consume_lowtarif_perc":0,"delivery_perc":23.818181818181817,"perc_of_active_connections":93.16272727272727},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22805","wijknaam2019":"Veluwse Poort","year":2019,"annual_consume":28782,"num_connections":1400,"annual_consume_lowtarif_perc":0,"delivery_perc":25.714285714285715,"perc_of_active_connections":98.9042857142857},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2010,"annual_consume":254749,"num_connections":12200,"annual_consume_lowtarif_perc":0,"delivery_perc":22.721311475409838,"perc_of_active_connections":96.19524590163934},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2011,"annual_consume":251591,"num_connections":12300,"annual_consume_lowtarif_perc":0,"delivery_perc":22.772357723577237,"perc_of_active_connections":90.06105691056909},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2012,"annual_consume":261134,"num_connections":12800,"annual_consume_lowtarif_perc":0,"delivery_perc":23.078125,"perc_of_active_connections":91.9284375},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2013,"annual_consume":246067,"num_connections":12800,"annual_consume_lowtarif_perc":0,"delivery_perc":23.1953125,"perc_of_active_connections":91.77382812500001},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2014,"annual_consume":241389,"num_connections":13200,"annual_consume_lowtarif_perc":0,"delivery_perc":24.113636363636363,"perc_of_active_connections":90.70227272727273},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2015,"annual_consume":491369,"num_connections":25200,"annual_consume_lowtarif_perc":0,"delivery_perc":23.76984126984127,"perc_of_active_connections":95.2731746031746},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2016,"annual_consume":234577,"num_connections":13600,"annual_consume_lowtarif_perc":0,"delivery_perc":24.933823529411764,"perc_of_active_connections":91.48794117647058},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2017,"annual_consume":227188,"num_connections":13900,"annual_consume_lowtarif_perc":0,"delivery_perc":25.258992805755394,"perc_of_active_connections":92.8808633093525},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2018,"annual_consume":236124,"num_connections":14300,"annual_consume_lowtarif_perc":0,"delivery_perc":25.55944055944056,"perc_of_active_connections":91.67853146853146},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22810","wijknaam2019":"Ede-Zuid","year":2019,"annual_consume":242058,"num_connections":14600,"annual_consume_lowtarif_perc":0,"delivery_perc":25.589041095890412,"perc_of_active_connections":92.29534246575342},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2010,"annual_consume":147050,"num_connections":10500,"annual_consume_lowtarif_perc":0,"delivery_perc":26.457142857142856,"perc_of_active_connections":99.7949523809524},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2011,"annual_consume":145395,"num_connections":10500,"annual_consume_lowtarif_perc":0,"delivery_perc":26.457142857142856,"perc_of_active_connections":99.84371428571428},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2012,"annual_consume":144523,"num_connections":10500,"annual_consume_lowtarif_perc":0,"delivery_perc":26.457142857142856,"perc_of_active_connections":99.812},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2013,"annual_consume":137897,"num_connections":10500,"annual_consume_lowtarif_perc":0,"delivery_perc":26.457142857142856,"perc_of_active_connections":99.812},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2014,"annual_consume":134540,"num_connections":10500,"annual_consume_lowtarif_perc":0,"delivery_perc":26.457142857142856,"perc_of_active_connections":99.80714285714286},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2015,"annual_consume":283390,"num_connections":21000,"annual_consume_lowtarif_perc":0,"delivery_perc":26.423809523809524,"perc_of_active_connections":99.88995238095238},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2016,"annual_consume":128605,"num_connections":10500,"annual_consume_lowtarif_perc":0,"delivery_perc":26.457142857142856,"perc_of_active_connections":99.81990476190477},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2017,"annual_consume":125323,"num_connections":10400,"annual_consume_lowtarif_perc":0,"delivery_perc":26.21153846153846,"perc_of_active_connections":99.81817307692307},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2018,"annual_consume":128168,"num_connections":10400,"annual_consume_lowtarif_perc":0,"delivery_perc":26.221153846153847,"perc_of_active_connections":99.53711538461538},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22811","wijknaam2019":"Maandereng","year":2019,"annual_consume":128154,"num_connections":10500,"annual_consume_lowtarif_perc":0,"delivery_perc":26.466666666666665,"perc_of_active_connections":99.49390476190477},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2010,"annual_consume":195670,"num_connections":13000,"annual_consume_lowtarif_perc":0,"delivery_perc":24.076923076923077,"perc_of_active_connections":99.30923076923078},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2011,"annual_consume":191194,"num_connections":13000,"annual_consume_lowtarif_perc":0,"delivery_perc":24.084615384615386,"perc_of_active_connections":99.24053846153846},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2012,"annual_consume":187400,"num_connections":13000,"annual_consume_lowtarif_perc":0,"delivery_perc":24.084615384615386,"perc_of_active_connections":99.80907692307693},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2013,"annual_consume":179060,"num_connections":13000,"annual_consume_lowtarif_perc":0,"delivery_perc":24.1,"perc_of_active_connections":99.78099999999999},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2014,"annual_consume":175531,"num_connections":13000,"annual_consume_lowtarif_perc":0,"delivery_perc":24.107692307692307,"perc_of_active_connections":99.73638461538461},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2015,"annual_consume":372212,"num_connections":26000,"annual_consume_lowtarif_perc":0,"delivery_perc":24.084615384615386,"perc_of_active_connections":99.53046153846154},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2016,"annual_consume":168194,"num_connections":13000,"annual_consume_lowtarif_perc":0,"delivery_perc":24.146153846153847,"perc_of_active_connections":99.56961538461537},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2017,"annual_consume":167286,"num_connections":13000,"annual_consume_lowtarif_perc":0,"delivery_perc":24.153846153846153,"perc_of_active_connections":99.54930769230769},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen","year":2018,"annual_consume":168010,"num_connections":13000,"annual_consume_lowtarif_perc":0,"delivery_perc":24.153846153846153,"perc_of_active_connections":99.3526923076923},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22812","wijknaam2019":"Rietkampen",
"year":2019,"annual_consume":165588,"num_connections":13000,"annual_consume_lowtarif_perc":0,"delivery_perc":24.315384615384616,"perc_of_active_connections":99.09292307692307},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2010,"annual_consume":130179,"num_connections":1900,"annual_consume_lowtarif_perc":0,"delivery_perc":28.789473684210527,"perc_of_active_connections":91.85894736842104},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2011,"annual_consume":135283,"num_connections":2000,"annual_consume_lowtarif_perc":0,"delivery_perc":27.65,"perc_of_active_connections":92.0315},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2012,"annual_consume":138017,"num_connections":2200,"annual_consume_lowtarif_perc":0,"delivery_perc":25.318181818181817,"perc_of_active_connections":90.15727272727274},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2013,"annual_consume":138138,"num_connections":2400,"annual_consume_lowtarif_perc":0,"delivery_perc":24.291666666666668,"perc_of_active_connections":87.92416666666668},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2014,"annual_consume":141619,"num_connections":2400,"annual_consume_lowtarif_perc":0,"delivery_perc":24.458333333333332,"perc_of_active_connections":88.21499999999999},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2015,"annual_consume":267146,"num_connections":4300,"annual_consume_lowtarif_perc":0,"delivery_perc":25.697674418604652,"perc_of_active_connections":91.64720930232556},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2016,"annual_consume":132287,"num_connections":2500,"annual_consume_lowtarif_perc":0,"delivery_perc":25.08,"perc_of_active_connections":86.24600000000001},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2017,"annual_consume":130485,"num_connections":2500,"annual_consume_lowtarif_perc":0,"delivery_perc":25.56,"perc_of_active_connections":84.33},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2018,"annual_consume":139662,"num_connections":2600,"annual_consume_lowtarif_perc":0,"delivery_perc":26.923076923076923,"perc_of_active_connections":84.1923076923077},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22813","wijknaam2019":"Bedrijventerrein","year":2019,"annual_consume":146078,"num_connections":2800,"annual_consume_lowtarif_perc":0,"delivery_perc":25.285714285714285,"perc_of_active_connections":84.57785714285716},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2010,"annual_consume":130060,"num_connections":3100,"annual_consume_lowtarif_perc":0,"delivery_perc":25.322580645161292,"perc_of_active_connections":97.84387096774194},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2011,"annual_consume":129956,"num_connections":3200,"annual_consume_lowtarif_perc":0,"delivery_perc":25.25,"perc_of_active_connections":97.1228125},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2012,"annual_consume":131967,"num_connections":3400,"annual_consume_lowtarif_perc":0,"delivery_perc":24.470588235294116,"perc_of_active_connections":94.10676470588234},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2013,"annual_consume":128422,"num_connections":3400,"annual_consume_lowtarif_perc":0,"delivery_perc":24.705882352941178,"perc_of_active_connections":96.41088235294117},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2014,"annual_consume":124485,"num_connections":3400,"annual_consume_lowtarif_perc":0,"delivery_perc":24.941176470588236,"perc_of_active_connections":96.54205882352942},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2015,"annual_consume":253292,"num_connections":6600,"annual_consume_lowtarif_perc":0,"delivery_perc":24.757575757575758,"perc_of_active_connections":97.36015151515153},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2016,"annual_consume":128861,"num_connections":3600,"annual_consume_lowtarif_perc":0,"delivery_perc":24.555555555555557,"perc_of_active_connections":95.9863888888889},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2017,"annual_consume":124842,"num_connections":3600,"annual_consume_lowtarif_perc":0,"delivery_perc":24.72222222222222,"perc_of_active_connections":95.9686111111111},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2018,"annual_consume":125083,"num_connections":3600,"annual_consume_lowtarif_perc":0,"delivery_perc":24.97222222222222,"perc_of_active_connections":95.97305555555553},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22820","wijknaam2019":"Buitengebied Ede-Stad","year":2019,"annual_consume":126108,"num_connections":3600,"annual_consume_lowtarif_perc":0,"delivery_perc":25.13888888888889,"perc_of_active_connections":95.25666666666666},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2010,"annual_consume":730505,"num_connections":27400,"annual_consume_lowtarif_perc":0,"delivery_perc":22.375912408759124,"perc_of_active_connections":99.158102189781},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2011,"annual_consume":711868,"num_connections":27200,"annual_consume_lowtarif_perc":0,"delivery_perc":22.514705882352942,"perc_of_active_connections":98.94338235294117},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2012,"annual_consume":704880,"num_connections":27500,"annual_consume_lowtarif_perc":0,"delivery_perc":22.487272727272728,"perc_of_active_connections":98.48141818181819},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2013,"annual_consume":683360,"num_connections":27700,"annual_consume_lowtarif_perc":0,"delivery_perc":22.577617328519857,"perc_of_active_connections":98.41425992779781},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2014,"annual_consume":669295,"num_connections":27700,"annual_consume_lowtarif_perc":0,"delivery_perc":22.664259927797833,"perc_of_active_connections":98.1472202166065},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2015,"annual_consume":1403957,"num_connections":55400,"annual_consume_lowtarif_perc":0,"delivery_perc":22.541516245487365,"perc_of_active_connections":98.5992238267148},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2016,"annual_consume":639589,"num_connections":28000,"annual_consume_lowtarif_perc":0,"delivery_perc":22.92142857142857,"perc_of_active_connections":97.6857857142857},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2017,"annual_consume":640969,"num_connections":28300,"annual_consume_lowtarif_perc":0,"delivery_perc":22.968197879858657,"perc_of_active_connections":97.76992932862191},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2018,"annual_consume":641674,"num_connections":28400,"annual_consume_lowtarif_perc":0,"delivery_perc":22.954225352112676,"perc_of_active_connections":97.57721830985916},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22830","wijknaam2019":"Bennekom","year":2019,"annual_consume":630977,"num_connections":28600,"annual_consume_lowtarif_perc":0,"delivery_perc":23.09090909090909,"perc_of_active_connections":96.66349650349652},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2010,"annual_consume":845493,"num_connections":24500,"annual_consume_lowtarif_perc":0,"delivery_perc":22.016326530612243,"perc_of_active_connections":98.5007755102041},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2011,"annual_consume":829592,"num_connections":24600,"annual_consume_lowtarif_perc":0,"delivery_perc":22.203252032520325,"perc_of_active_connections":97.77756097560975},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2012,"annual_consume":809357,"num_connections":24900,"annual_consume_lowtarif_perc":0,"delivery_perc":23.016064257028113,"perc_of_active_connections":97.58791164658632},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2013,"annual_consume":811218,"num_connections":25400,"annual_consume_lowtarif_perc":0,"delivery_perc":22.80708661417323,"perc_of_active_connections":96.97692913385825},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2014,"annual_consume":789917,"num_connections":25600,"annual_consume_lowtarif_perc":0,"delivery_perc":23.1875,"perc_of_active_connections":96.2430078125},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2015,"annual_consume":1621794,"num_connections":50400,"annual_consume_lowtarif_perc":0,"delivery_perc":22.654761904761905,"perc_of_active_connections":97.3597023809524},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren",
"year":2016,"annual_consume":763387,"num_connections":26300,"annual_consume_lowtarif_perc":0,"delivery_perc":23.619771863117872,"perc_of_active_connections":95.75688212927753},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2017,"annual_consume":775227,"num_connections":26400,"annual_consume_lowtarif_perc":0,"delivery_perc":23.666666666666668,"perc_of_active_connections":95.68818181818183},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2018,"annual_consume":782727,"num_connections":26700,"annual_consume_lowtarif_perc":0,"delivery_perc":23.700374531835205,"perc_of_active_connections":95.64176029962543},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22840","wijknaam2019":"Lunteren","year":2019,"annual_consume":772510,"num_connections":26800,"annual_consume_lowtarif_perc":0,"delivery_perc":23.917910447761194,"perc_of_active_connections":95.04817164179104},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2010,"annual_consume":180448,"num_connections":6100,"annual_consume_lowtarif_perc":0,"delivery_perc":19.540983606557376,"perc_of_active_connections":99.21655737704918},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2011,"annual_consume":175027,"num_connections":6100,"annual_consume_lowtarif_perc":0,"delivery_perc":19.62295081967213,"perc_of_active_connections":99.00213114754098},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2012,"annual_consume":171994,"num_connections":6100,"annual_consume_lowtarif_perc":0,"delivery_perc":19.704918032786885,"perc_of_active_connections":98.43081967213115},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2013,"annual_consume":165427,"num_connections":6100,"annual_consume_lowtarif_perc":0,"delivery_perc":19.885245901639344,"perc_of_active_connections":98.32491803278688},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2014,"annual_consume":161742,"num_connections":6100,"annual_consume_lowtarif_perc":0,"delivery_perc":20.147540983606557,"perc_of_active_connections":97.87377049180327},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2015,"annual_consume":341575,"num_connections":12200,"annual_consume_lowtarif_perc":0,"delivery_perc":19.89344262295082,"perc_of_active_connections":98.54040983606558},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2016,"annual_consume":156836,"num_connections":6300,"annual_consume_lowtarif_perc":0,"delivery_perc":20.555555555555557,"perc_of_active_connections":97.87},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2017,"annual_consume":159804,"num_connections":6300,"annual_consume_lowtarif_perc":0,"delivery_perc":21.158730158730158,"perc_of_active_connections":97.65952380952383},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2018,"annual_consume":157842,"num_connections":6400,"annual_consume_lowtarif_perc":0,"delivery_perc":21.265625,"perc_of_active_connections":97.70468749999999},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22850","wijknaam2019":"Ederveen","year":2019,"annual_consume":157485,"num_connections":6400,"annual_consume_lowtarif_perc":0,"delivery_perc":21.484375,"perc_of_active_connections":97.52921874999998},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2010,"annual_consume":22928,"num_connections":600,"annual_consume_lowtarif_perc":0,"delivery_perc":36.5,"perc_of_active_connections":98.185},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2011,"annual_consume":21522,"num_connections":600,"annual_consume_lowtarif_perc":0,"delivery_perc":36.833333333333336,"perc_of_active_connections":94.71666666666665},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2012,"annual_consume":20713,"num_connections":600,"annual_consume_lowtarif_perc":0,"delivery_perc":37,"perc_of_active_connections":93.99166666666667},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2013,"annual_consume":20595,"num_connections":600,"annual_consume_lowtarif_perc":0,"delivery_perc":37,"perc_of_active_connections":93.45333333333333},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2014,"annual_consume":21726,"num_connections":700,"annual_consume_lowtarif_perc":0,"delivery_perc":27.285714285714285,"perc_of_active_connections":88.44285714285715},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2015,"annual_consume":44248,"num_connections":1300,"annual_consume_lowtarif_perc":0,"delivery_perc":31.53846153846154,"perc_of_active_connections":92.71307692307693},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2016,"annual_consume":20798,"num_connections":700,"annual_consume_lowtarif_perc":0,"delivery_perc":27.571428571428573,"perc_of_active_connections":86.42571428571429},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2017,"annual_consume":21705,"num_connections":700,"annual_consume_lowtarif_perc":0,"delivery_perc":27.571428571428573,"perc_of_active_connections":86.42571428571429},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2018,"annual_consume":22455,"num_connections":700,"annual_consume_lowtarif_perc":0,"delivery_perc":27.571428571428573,"perc_of_active_connections":84.82714285714285},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22860","wijknaam2019":"De Klomp","year":2019,"annual_consume":21956,"num_connections":700,"annual_consume_lowtarif_perc":0,"delivery_perc":28,"perc_of_active_connections":84.17428571428572},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2010,"annual_consume":200931,"num_connections":5300,"annual_consume_lowtarif_perc":0,"delivery_perc":20.69811320754717,"perc_of_active_connections":98.88849056603775},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2011,"annual_consume":195315,"num_connections":5300,"annual_consume_lowtarif_perc":0,"delivery_perc":20.830188679245282,"perc_of_active_connections":98.4132075471698},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2012,"annual_consume":200563,"num_connections":5500,"annual_consume_lowtarif_perc":0,"delivery_perc":20.545454545454547,"perc_of_active_connections":98.59127272727272},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2013,"annual_consume":196846,"num_connections":5600,"annual_consume_lowtarif_perc":0,"delivery_perc":20.339285714285715,"perc_of_active_connections":98.3967857142857},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2014,"annual_consume":198233,"num_connections":5800,"annual_consume_lowtarif_perc":0,"delivery_perc":19.70689655172414,"perc_of_active_connections":97.96810344827585},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2015,"annual_consume":398251,"num_connections":11200,"annual_consume_lowtarif_perc":0,"delivery_perc":20.026785714285715,"perc_of_active_connections":98.85883928571427},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2016,"annual_consume":190491,"num_connections":6000,"annual_consume_lowtarif_perc":0,"delivery_perc":19.633333333333333,"perc_of_active_connections":98.05616666666666},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2017,"annual_consume":193296,"num_connections":6100,"annual_consume_lowtarif_perc":0,"delivery_perc":19.852459016393443,"perc_of_active_connections":97.68754098360657},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2018,"annual_consume":191307,"num_connections":6100,"annual_consume_lowtarif_perc":0,"delivery_perc":19.885245901639344,"perc_of_active_connections":97.56836065573772},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22870","wijknaam2019":"Harskamp","year":2019,"annual_consume":190511,"num_connections":6200,"annual_consume_lowtarif_perc":0,"delivery_perc":20.080645161290324,"perc_of_active_connections":97.70451612903224},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2010,"annual_consume":126211,"num_connections":3700,"annual_consume_lowtarif_perc":0,"delivery_perc":21.594594594594593,"perc_of_active_connections":98.78162162162161},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2011,"annual_consume":122351,"num_connections":3700,"annual_consume_lowtarif_perc":0,"delivery_perc":21.89189189189189,"perc_of_active_connections":98.91189189189188},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2012,"annual_consume":125203,"num_connections":3800,"annual_consume_lowtarif_perc":0,"delivery_perc":21.68421052631579,"perc_of_active_connections":97.19131578947368},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2013,"annual_consume":125390,"num_connections":3900,"annual_consume_lowtarif_perc":0,"delivery_perc":21.46153846153846,"perc_of_active_connections":97.75102564102566},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880",
"wijknaam2019":"Wekerom","year":2014,"annual_consume":119190,"num_connections":3800,"annual_consume_lowtarif_perc":0,"delivery_perc":22.973684210526315,"perc_of_active_connections":96.82605263157896},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2015,"annual_consume":238594,"num_connections":7500,"annual_consume_lowtarif_perc":0,"delivery_perc":22.36,"perc_of_active_connections":97.58493333333332},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2016,"annual_consume":112561,"num_connections":4000,"annual_consume_lowtarif_perc":0,"delivery_perc":23.175,"perc_of_active_connections":96.58275},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2017,"annual_consume":120969,"num_connections":4300,"annual_consume_lowtarif_perc":0,"delivery_perc":22.953488372093023,"perc_of_active_connections":96.18325581395347},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2018,"annual_consume":118708,"num_connections":4300,"annual_consume_lowtarif_perc":0,"delivery_perc":23.325581395348838,"perc_of_active_connections":93.21139534883719},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22880","wijknaam2019":"Wekerom","year":2019,"annual_consume":118595,"num_connections":4400,"annual_consume_lowtarif_perc":0,"delivery_perc":23.227272727272727,"perc_of_active_connections":96.23659090909092},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2010,"annual_consume":188147,"num_connections":4500,"annual_consume_lowtarif_perc":0,"delivery_perc":21.644444444444446,"perc_of_active_connections":98.53466666666665},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2011,"annual_consume":183213,"num_connections":4500,"annual_consume_lowtarif_perc":0,"delivery_perc":21.844444444444445,"perc_of_active_connections":98.53466666666665},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2012,"annual_consume":183879,"num_connections":4500,"annual_consume_lowtarif_perc":0,"delivery_perc":22.044444444444444,"perc_of_active_connections":98.35822222222224},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2013,"annual_consume":176458,"num_connections":4500,"annual_consume_lowtarif_perc":0,"delivery_perc":22.066666666666666,"perc_of_active_connections":98.2928888888889},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2014,"annual_consume":171025,"num_connections":4500,"annual_consume_lowtarif_perc":0,"delivery_perc":22.244444444444444,"perc_of_active_connections":97.76844444444444},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2015,"annual_consume":359506,"num_connections":9000,"annual_consume_lowtarif_perc":0,"delivery_perc":21.966666666666665,"perc_of_active_connections":97.85888888888888},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2016,"annual_consume":166855,"num_connections":4500,"annual_consume_lowtarif_perc":0,"delivery_perc":22.333333333333332,"perc_of_active_connections":96.92577777777777},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2017,"annual_consume":175743,"num_connections":4700,"annual_consume_lowtarif_perc":0,"delivery_perc":22.21276595744681,"perc_of_active_connections":96.24063829787232},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2018,"annual_consume":176503,"num_connections":4700,"annual_consume_lowtarif_perc":0,"delivery_perc":22.4468085106383,"perc_of_active_connections":96.0163829787234},{"gemeente2019":"228","gemeentenaam2019":"Ede","wijk2019":"22890","wijknaam2019":"Otterlo","year":2019,"annual_consume":170719,"num_connections":4700,"annual_consume_lowtarif_perc":0,"delivery_perc":22.51063829787234,"perc_of_active_connections":95.20659574468083}],"electricity_manager":[{"net_manager":"Liander N.V.","gemeente2019":"228","gemeentenaam2019":"Ede","year":2010,"annual_consume":12709966,"num_connections":212256.59,"annual_consume_lowtarif_perc":28.15123178185239,"delivery_perc":23.42031029619182,"perc_of_active_connections":95.73246356370475},{"net_manager":"Liander N.V.","gemeente2019":"228","gemeentenaam2019":"Ede","year":2011,"annual_consume":12788932,"num_connections":213063.18,"annual_consume_lowtarif_perc":37.29589419475655,"delivery_perc":23.700842696629213,"perc_of_active_connections":95.00422752808998},{"net_manager":"Liander N.V.","gemeente2019":"228","gemeentenaam2019":"Ede","year":2012,"annual_consume":12927963,"num_connections":216098.77,"annual_consume_lowtarif_perc":36.72179428044281,"delivery_perc":23.926660516605168,"perc_of_active_connections":94.47870848708493},{"net_manager":"Liander N.V.","gemeente2019":"228","gemeentenaam2019":"Ede","year":2013,"annual_consume":12874736,"num_connections":217213.96000000002,"annual_consume_lowtarif_perc":38.242836911831894,"delivery_perc":24.194152581087256,"perc_of_active_connections":94.3902055733212},{"net_manager":"Liander N.V.","gemeente2019":"228","gemeentenaam2019":"Ede","year":2014,"annual_consume":12985125,"num_connections":213649.3900000001,"annual_consume_lowtarif_perc":41.40977787851316,"delivery_perc":24.35131459655485,"perc_of_active_connections":92.56286038077975},{"net_manager":"Liander N.V.","gemeente2019":"228","gemeentenaam2019":"Ede","year":2015,"annual_consume":12641393,"num_connections":213709.7900000001,"annual_consume_lowtarif_perc":42.38593258426967,"delivery_perc":24.519101123595505,"perc_of_active_connections":92.33178426966298},{"net_manager":"Liander N.V.","gemeente2019":"228","gemeentenaam2019":"Ede","year":2016,"annual_consume":12550147,"num_connections":211899.95000000013,"annual_consume_lowtarif_perc":47.45334225792054,"delivery_perc":24.73850959393128,"perc_of_active_connections":92.27740740740745},{"net_manager":"Liander N.V.","gemeente2019":"228","gemeentenaam2019":"Ede","year":2017,"annual_consume":12342830,"num_connections":210244.76000000004,"annual_consume_lowtarif_perc":49.96639293598233,"delivery_perc":24.8476821192053,"perc_of_active_connections":92.13759381898458},{"net_manager":"Liander N.V.","gemeente2019":"228","gemeentenaam2019":"Ede","year":2018,"annual_consume":12207933,"num_connections":208791.56,"annual_consume_lowtarif_perc":52.26584171403584,"delivery_perc":25.078268473983385,"perc_of_active_connections":91.7665150852646},{"net_manager":"Liander N.V.","gemeente2019":"228","gemeentenaam2019":"Ede","year":2019,"annual_consume":12547692,"num_connections":210544.09000000003,"annual_consume_lowtarif_perc":28.44055977229603,"delivery_perc":23.246679316888045,"perc_of_active_connections":96.17319734345352},{"net_manager":"Liander N.V. (NW)","gemeente2019":"228","gemeentenaam2019":"Ede","year":2010,"annual_consume":100665,"num_connections":1000,"annual_consume_lowtarif_perc":27.519,"delivery_perc":29.7,"perc_of_active_connections":90.03},{"net_manager":"Liander N.V. (NW)","gemeente2019":"228","gemeentenaam2019":"Ede","year":2011,"annual_consume":106188,"num_connections":1000,"annual_consume_lowtarif_perc":35.89,"delivery_perc":29.8,"perc_of_active_connections":90.063},{"net_manager":"Liander N.V. (NW)","gemeente2019":"228","gemeentenaam2019":"Ede","year":2012,"annual_consume":115742,"num_connections":1100,"annual_consume_lowtarif_perc":34.942727272727275,"delivery_perc":30.727272727272727,"perc_of_active_connections":87.34181818181818},{"net_manager":"Liander N.V. (NW)","gemeente2019":"228","gemeentenaam2019":"Ede","year":2013,"annual_consume":111157,"num_connections":1085.12,"annual_consume_lowtarif_perc":37.947272727272725,"delivery_perc":31.545454545454547,"perc_of_active_connections":85.16909090909093},{"net_manager":"Liander N.V. (NW)","gemeente2019":"228","gemeentenaam2019":"Ede","year":2014,"annual_consume":104810,"num_connections":1055.46,"annual_consume_lowtarif_perc":39.92999999999999,"delivery_perc":29.727272727272727,"perc_of_active_connections":84.22090909090909},{"net_manager":"Liander N.V. (NW)","gemeente2019":"228","gemeentenaam2019":"Ede","year":2015,"annual_consume":100746,"num_connections":1040.76,"annual_consume_lowtarif_perc":39.52909090909091,"delivery_perc":29.727272727272727,"perc_of_active_connections":83.87090909090908},{"net_manager":"Liander N.V. (NW)","gemeente2019":"228","gemeentenaam2019":"Ede","year":2016,"annual_consume":107489,"num_connections":1030.79,"annual_consume_lowtarif_perc":41.693636363636365,"delivery_perc":29.90909090909091,"perc_of_active_connections":83.53454545454545},{"net_manager":"Liander N.V. (NW)","gemeente2019":"228","gemeentenaam2019":"Ede","year":2017,"annual_consume":112645,"num_connections":1119.3500000000001,"annual_consume_lowtarif_perc":46.30666666666667,"delivery_perc":29,"perc_of_active_connections":83.48666666666666},{"net_manager":"Liander N.V. (NW)","gemeente2019":"228","gemeentenaam2019":"Ede","year":2018,"annual_consume":114816,"num_connections":1099.3,"annual_consume_lowtarif_perc":47.73833333333332,"delivery_perc":27.833333333333332,"perc_of_active_connections":82.76583333333333},{"net_manager":"Liander N.V. (NW)","gemeente2019":"228","gemeentenaam2019":"Ede","year":2019,"annual_consume":99998,"num_connections":1000,"annual_consume_lowtarif_perc":29.211000000000002,"delivery_perc":28.7,"perc_of_active_connections":92.386}],"gas_manager":[{"net_manager":"GAS Liander","gemeente2019":"228","gemeentenaam2019":"Ede","year":2010,"annual_consume":4651534,"num_connections":189300,"annual_consume_lowtarif_perc":0,"delivery_perc":22.47649234020074,"perc_of_active_connections":98.63643951399895},{"net_manager":"GAS Liander","gemeente2019":"228","gemeentenaam2019":"Ede","year":2011,"annual_consume":4571793,
"num_connections":190000,"annual_consume_lowtarif_perc":0,"delivery_perc":22.64315789473684,"perc_of_active_connections":97.86558421052632},{"net_manager":"GAS Liander","gemeente2019":"228","gemeentenaam2019":"Ede","year":2012,"annual_consume":4537942,"num_connections":192300,"annual_consume_lowtarif_perc":0,"delivery_perc":22.741029641185648,"perc_of_active_connections":97.77809152366095},{"net_manager":"GAS Liander","gemeente2019":"228","gemeentenaam2019":"Ede","year":2013,"annual_consume":4411068,"num_connections":193600,"annual_consume_lowtarif_perc":0,"delivery_perc":22.789772727272727,"perc_of_active_connections":97.72964359504135},{"net_manager":"GAS Liander","gemeente2019":"228","gemeentenaam2019":"Ede","year":2014,"annual_consume":4333678,"num_connections":194700,"annual_consume_lowtarif_perc":0,"delivery_perc":22.924499229583976,"perc_of_active_connections":97.31499229583976},{"net_manager":"GAS Liander","gemeente2019":"228","gemeentenaam2019":"Ede","year":2015,"annual_consume":8922180,"num_connections":384900,"annual_consume_lowtarif_perc":0,"delivery_perc":22.678098207326578,"perc_of_active_connections":98.08892179786965},{"net_manager":"GAS Liander","gemeente2019":"228","gemeentenaam2019":"Ede","year":2016,"annual_consume":4182631,"num_connections":198400,"annual_consume_lowtarif_perc":0,"delivery_perc":23.14717741935484,"perc_of_active_connections":97.1104284274194},{"net_manager":"GAS Liander","gemeente2019":"228","gemeentenaam2019":"Ede","year":2017,"annual_consume":4192644,"num_connections":200100,"annual_consume_lowtarif_perc":0,"delivery_perc":23.192903548225885,"perc_of_active_connections":97.07509745127435},{"net_manager":"GAS Liander","gemeente2019":"228","gemeentenaam2019":"Ede","year":2018,"annual_consume":4234390,"num_connections":201900,"annual_consume_lowtarif_perc":0,"delivery_perc":23.2704309063893,"perc_of_active_connections":96.75851906884597},{"net_manager":"Liander NB","gemeente2019":"228","gemeentenaam2019":"Ede","year":2019,"annual_consume":4199441,"num_connections":203500,"annual_consume_lowtarif_perc":0,"delivery_perc":23.39115479115479,"perc_of_active_connections":96.5411842751843}]};

export class BarChart extends Component {
    makeChart() {
        let data = this.props.data;
        // let data = data_test;

        if (data !== null) {
            // Select energy source
            let children = data[this.props.source];
            
            // Filter years
            children = children.filter((child) => {
                return this.props.years.includes(child.year);
            });

            // Aggregate attributes
            let children2 = [];
            children.reduce((res, val) => {
                let x;
                switch(this.props.scope) {
                    case 'national':
                        x = val.gemeentenaam2019;
                        break;
                    case 'gemeente':
                        x = val.wijknaam2019;
                        break;
                    case 'wijk':
                        x = val.buurtnaam2019;
                        break;
                    case 'buurt':
                        x = val.street;
                        break;
                }

                if (!res[x]) {
                    res[x] = { x: x, y: 0 };
                    children2.push(res[x]);
                }

                switch(this.props.dataType) {
                    case 1:
                        res[x].y += val.annual_consume;
                        break;
                    case 2:
                        res[x].y += val.annual_consume / (val.num_connections * (val.perc_of_active_connections / 100));
                        break;
                    case 3:
                        res[x].y += val.annual_consume * (1 - val.delivery_perc / 100);
                        break;
                    case 4:
                        res[x].y += val.annual_consume * (1 - val.delivery_perc / 100) / (val.num_connections * (val.perc_of_active_connections / 100));
                        break;
                    case 5:
                        res[x].y += val.num_connections * (val.perc_of_active_connections / 100);
                        break;
                    case 6:
                        res[x].y += val.num_connections * (val.smartmeter_perc / 100);
                        break;
                }
                return res;
            }, {});

            // Sort on attribute and select first/last 5 elements
            children2.sort((a, b) => { return b.y - a.y });
            if (this.props.type === 'top') {
                data = children2.slice(0, 5);
            } else if (this.props.type === 'bottom') {
                data = children2.slice(children2.length - 5);
            }

            const cap = calcCap(data[0].y);
        
            data = data.map((d) => {
                var d2 = {};
                d2.x = d.x;
                d2.y = capValue(d.y, cap);
                return d2;
            });
            // console.log('BarChart', data);

            const max = Math.max.apply(Math, data.map(function(d) { return d.y; }));
            const svg = select('#'+this.props.id);

            svg.selectAll("*")
            .remove();
            
            const margin = this.props.settings.margin;
            let width = this.props.settings.width - 2 * margin;
            const height = this.props.settings.height - 2 * margin;

            if (document.getElementById(this.props.id)) {
                width = document.getElementById(this.props.id).clientWidth - 1.3 * margin;
            }

            const chart = svg.append('g')
            .attr('transform', `translate(${margin}, ${margin})`);

            const xScale = scaleBand()
            .range([0, width])
            .domain(data.map((d) => d.x))
            .padding(0.4);
            
            const yScale = scaleLinear()
            .range([height, 0])
            .domain([0, Math.ceil(max*1.1) > 1 ? Math.ceil(max*1.1) : 1]);

            const makeYLines = () => axisLeft()
            .scale(yScale);

            chart.append('g')
            .attr('transform', `translate(0, ${height})`)
            .attr('id', 'axis-' + this.props.id)
            .call(axisBottom(xScale));

            const labels = document.getElementById('axis-' + this.props.id).getElementsByTagName('text');
            for (let i = 0; i < labels.length; i++) {
                let label = labels[i].innerHTML;
                if (label.length <= 12) {
                    labels[i].innerHTML = `<tspan x='0' dy='8'>${label}</tspan>`;
                } else {
                    labels[i].innerHTML = `<tspan x='0' dy='8'>${label.substring(0, 11)}-</tspan><tspan x='0' dy='14'>${label.substring(11)}</tspan>`;
                }
            }

            chart.append('g')
            .call(axisLeft(yScale));

            chart.append('g')
            .attr('class', 'grid')
            .call(makeYLines()
                .tickSize(-width, 0, 0)
                .tickFormat('')
            );

            const barGroups = chart.selectAll()
            .data(data)
            .enter()
            .append('g');

            barGroups.append('rect')
            .attr('class', 'bar')
            .attr('x', (g) => xScale(g.x))
            .attr('y', (g) => yScale(g.y))
            .attr('height', (g) => height - yScale(g.y))
            .attr('width', xScale.bandwidth());

            barGroups.append('text')
            .attr('class', 'value')
            .attr('x', (a) => xScale(a.x) + xScale.bandwidth() / 2)
            .attr('y', (a) => yScale(a.y) + 15)
            .attr('text-anchor', 'middle')
            .text((a) => `${a.y}`);
            
            let labelText = '';
            switch(cap) {
                case 'b':
                    labelText = 'x1,000,000,000';
                    break;
                case 'm':
                    labelText = 'x1,000,000';
                    break;
                case 'k':
                    labelText = 'x1,000';
                    break;
            }
            if (this.props.dataType <= 4) {
                labelText += (this.props.source === 'gas'? ' m^3' : ' kWh');
            }
            svg.append('text')
            .attr('class', 'label')
            .attr('x', -(height / 2) - margin)
            .attr('y', margin / 2.4)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text(labelText);

            let scopeText;
            switch(this.props.scope) {
                case 'national':
                    scopeText = 'Municipality';
                    break;
                case 'gemeente':
                    scopeText = 'District';
                    break;
                case 'wijk':
                    scopeText = 'Neighborhood';
                    break;
                case 'buurt':
                    scopeText = 'Street';
                    break;
            }
            svg.append('text')
            .attr('class', 'label')
            .attr('x', width / 2 + margin)
            .attr('y', height + margin * 1.9)
            .attr('text-anchor', 'middle')
            .text(scopeText);

            svg.append('text')
            .attr('class', 'title')
            .attr('x', width / 2 + margin)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text(capitalize(this.props.type) + ' 5');
        }
    }

    componentDidMount() {
        this.makeChart();
    }

    componentDidUpdate() {
        this.makeChart();
    }

    render() {
        return (
            <div className="svg-container">
                <svg className="svg-d3" id={this.props.id} />
            </div>
        )
    }
}

export class LineChart extends Component {
    makeChart() {
        let data = this.props.data;
        // let data = data_test;

        if (data !== null) {
            // Select energy source
            let children = data[this.props.source];
            
            // Filter years
            if (this.props.years.length > 1) {
                children = children.filter((child) => {
                    return this.props.years.includes(child.year);
                });
            }

            // Aggregate attributes
            let children2 = [];
            children.reduce((res, val) => {
                if (!res[val.year]) {
                    res[val.year] = { year: val.year, y: 0, t: 0 };
                    children2.push(res[val.year]);
                }
                switch(this.props.dataType) {
                    case 1:
                        res[val.year].y += val.annual_consume;
                        res[val.year].t += val.annual_consume * (val.annual_consume_lowtarif_perc / 100);
                        break;
                    case 2:
                        res[val.year].y += val.annual_consume / (val.num_connections * (val.perc_of_active_connections / 100));
                        res[val.year].t += (val.annual_consume / (val.num_connections * (val.perc_of_active_connections / 100))) * (val.annual_consume_lowtarif_perc / 100);
                        break;
                    case 3:
                        res[val.year].y += val.annual_consume * (1 - val.delivery_perc / 100);
                        break;
                    case 4:
                        res[val.year].y += val.annual_consume * (1 - val.delivery_perc / 100) / (val.num_connections * (val.perc_of_active_connections / 100));
                        break;
                    case 5:
                        res[val.year].y += val.num_connections * (val.perc_of_active_connections / 100);
                        break;
                    case 6:
                        res[val.year].y += val.num_connections * (val.smartmeter_perc / 100);
                        break;
                }
                return res;
            }, {});

            // Sort on attribute
            children2.sort((a, b) => { return a.year - b.year });
            data = children2;

            const cap = calcCap(Math.max.apply(Math, data.map(function(d) { return d.y; })));
        
            data = data.map((d) => {
                var d2 = {};
                d2.x = d.year;
                d2.y = capValue(d.y, cap);
                d2.t = capValue(d.t, cap);
                return d2;
            });
            // console.log('LineChart', data);

            const max = Math.max.apply(Math, data.map(function(d) { return d.y; }));
            const svg = selectAll('#'+this.props.id);

            svg.selectAll("*")
            .remove();
            
            const margin = this.props.settings.margin;
            let width = this.props.settings.width - 2 * margin;
            const height = this.props.settings.height - 2 * margin;

            if (document.getElementById(this.props.id)) {
                width = document.getElementById(this.props.id).clientWidth - 1.3 * margin;
            }

            const chart = svg.append('g')
            .attr('transform', `translate(${margin}, ${margin})`);

            const xScale = scaleBand()
            .range([0, width])
            .domain(data.map((d) => d.x))
            .padding(1);
            
            const yScale = scaleLinear()
            .range([height, 0])
            .domain([0, Math.ceil(max*1.1)]);

            const makeYLines = () => axisLeft()
            .scale(yScale);

            chart.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(axisBottom(xScale));

            chart.append('g')
            .call(axisLeft(yScale));

            chart.append('g')
            .attr('class', 'grid')
            .call(makeYLines()
                .tickSize(-width, 0, 0)
                .tickFormat('')
            );

            chart.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#FF6200")
            .attr("stroke-width", 1.5)
            .attr("d", line()
                .x(function(d) { return xScale(d.x) })
                .y(function(d) { return yScale(d.y) })
            );

            if ((this.props.dataType === 1 || this.props.dataType === 2) && this.props.source === 'electricity') {
                chart.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#FF6200")
                .attr("stroke-width", 1.5)
                .attr("d", line()
                    .x(function(d) { return xScale(d.x) })
                    .y(function(d) { return yScale(d.t) })
                );
            }
            
            let labelText = '';
            switch(cap) {
                case 'b':
                    labelText = 'x1,000,000,000';
                    break;
                case 'm':
                    labelText = 'x1,000,000';
                    break;
                case 'k':
                    labelText = 'x1,000';
                    break;
            }
            if (this.props.dataType <= 4) {
                labelText += (this.props.source === 'gas'? ' m^3' : ' kWh');
            }
            svg.append('text')
            .attr('class', 'label')
            .attr('x', -(height / 2) - margin)
            .attr('y', margin / 2.4)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text(labelText);

            svg.append('text')
            .attr('class', 'label')
            .attr('x', width / 2 + margin)
            .attr('y', height + margin * 1.9)
            .attr('text-anchor', 'middle')
            .text('Year');

            let headingText;
            switch(this.props.dataType) {
                case 1:
                    headingText = 'Energy consumption';
                    break;
                case 2:
                    headingText = 'Consumption per connection';
                    break;
                case 3:
                    headingText = 'Energy production';
                    break;
                case 4:
                    headingText = 'Production per connection';
                    break;
                case 5:
                    headingText = 'Number of connections';
                    break;
                case 6:
                    headingText = 'Number of smartmeters';
                    break;
            }
            if ((this.props.dataType === 1 || this.props.dataType === 2) && this.props.source === 'electricity') {
                headingText += ' (high vs low tarif)';
            }
            svg.append('text')
            .attr('class', 'title')
            .attr('x', width / 2 + margin)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text(headingText);
        }
    }

    componentDidMount() {
        this.makeChart();
    }

    componentDidUpdate() {
        this.makeChart();
    }

    render() {
        return (
            <div className="svg-container">
                <svg className="svg-d3" id={this.props.id} />
            </div>
        )
    }
}

export class PieChart extends Component {
    makeChart() {
        let data = this.props.data;
        // let data = data_test;

        if (data !== null) {
            // Select energy source
            let children = data[this.props.source + "_manager"];
            
            // Filter years
            children = children.filter((child) => {
                return this.props.years.includes(child.year);
            });

            const handleManager = (netmanager) => {
                const substring = netmanager.substring(0, 4);
                if (substring === '8716') {
                    return 'Stedin';
                } else if (substring === 'Enex') {
                    return 'Enexis';
                } else {
                    return 'Liander';
                }
            }

            // Aggregate attributes
            let children2 = [];
            children.reduce((res, val) => {
                let manager = handleManager(val.net_manager);
                if (!res[manager]) {
                    res[manager] = { net_manager: manager, y: 0 };
                    children2.push(res[manager]);
                }
                switch(this.props.type) {
                    case 'cons':
                        res[manager].y += val.annual_consume;
                        break;
                    case 'prod':
                        res[manager].y += val.annual_consume * (1 - val.delivery_perc / 100);
                        break;
                    case 'nuco':
                        res[manager].y += val.num_connections * (val.perc_of_active_connections / 100);
                        break;
                }
                return res;
            }, {});

            const cap = calcCap(Math.max.apply(Math, children2.map(function(d) { return d.y; })));

            // Convert array to object
            let children3 = {};
            children3 = children2.reduce((obj, item) => {
                return {
                ...obj,
                [item['net_manager']]: capValue(item.y, cap),
                };
            }, children3);

            data = children3;
            // console.log('PieChart', data);

            const svg = select('#'+this.props.id);
            svg.selectAll("*")
            .remove();
            
            const margin = this.props.settings.margin;
            const height = this.props.settings.height;
            let width = this.props.settings.width;

            if (document.getElementById(this.props.id)) {
                width = document.getElementById(this.props.id).clientWidth;
            }

            const radius = Math.min(width, height) / 2 - margin;

            const chart = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

            const color = scaleOrdinal()
            .domain(data)
            .range(["#ff6200", "#ff2f00", "#ffae00"])

            const piechart = pie().value(function(d) { return d.value; })
            const data_ready = piechart(entries(data))

            const arcGenerator = arc()
            .innerRadius(0)
            .outerRadius(radius)

            chart
            .selectAll('chart')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d) { return(color(d.data.key)) })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.9);

            const text = chart
            .selectAll('chart')
            .data(data_ready)
            .enter()
            .append('text')
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
            .style("text-anchor", "middle");
            
            text
            .append('tspan')
            .text(function(d) { return d.data.key })
            .attr('x', 0)
            .attr('dy', 0);

            text
            .append('tspan')
            .text(function(d) { return d.data.value })
            .attr('x', 0)
            .attr('dy', 15);

            let labelText = '';
            switch(cap) {
                case 'b':
                    labelText = 'x1,000,000,000';
                    break;
                case 'm':
                    labelText = 'x1,000,000';
                    break;
                case 'k':
                    labelText = 'x1,000';
                    break;
            }
            if (this.props.type === 'prod' || this.props.type === 'cons') {
                labelText += (this.props.source === 'gas'? ' m^3' : ' kWh');
            }
            svg.append('text')
            .attr('class', 'label')
            .attr('x', width / 2)
            .attr('y', height - margin / 2)
            .attr('text-anchor', 'middle')
            .text(labelText);

            let textProvider;
            switch(this.props.type) {
                case 'cons':
                    textProvider = 'Energy consumption';
                    break;
                case 'prod':
                    textProvider = 'Energy production';
                    break;
                case 'nuco':
                    textProvider = 'Number of connections';
                    break;
            }
            svg.append('text')
            .attr('class', 'title')
            .attr('x', width / 2)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text(textProvider);
        }
    }

    componentDidMount() {
        this.makeChart();
    }

    componentDidUpdate() {
        this.makeChart();
    }

    render() {
        return (
            <div className="svg-container">
                <svg className="svg-d3" id={this.props.id} />
            </div>
        )
    }
}