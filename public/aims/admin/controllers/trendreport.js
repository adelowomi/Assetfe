function trendreportCtrl ($scope, $http)
{

    $scope.companyname = $.session.get('nowcompanyname');
    $scope.analysisdescr = $.session.get('nowdescription');

    $scope.result = JSON.parse($.session.get('trendresult'));
    $scope.quickratio = [];
    $scope.currentratio = [];
    $scope.fixedassetturnover = [];
    $scope.netprofitmargin = [];
    $scope.returnonasset = [];
    $scope.returnonequity = [];
    $scope.returnoncommonequity = [];
    $scope.debttoequity = [];
    $scope.debttototalasset = [];
    $scope.freeflowcashratio = [];
    $scope.cashflowmargin = [];
    $scope.cashflowcoverage = [];
    $scope.periodticks = [];
    $scope.summary = [];

    $scope.liquidity_report = {};
    $scope.profitability_report = {};
    $scope.activity_report = {};
    $scope.leverage_report = {};

    $scope.fcr_report = {};
    $scope.cfm_report = {};
    $scope.cfc_report = {};
    //$scope.

    $scope.chartpoints = {
        show: true,
        lineWidth: 2,
        fill: true,
        fillColor: "#ffffff",
        symbol: "circle",
        radius: 5
    };

    $scope.chartgrid = {
        hoverable: true,
        clickable: true,
        tickColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#eeeeee"
    };

    for (i = 0; i < $scope.result.length; i++) {

        $scope.quickratio.push([$scope.result[i].Year, $scope.result[i].QR]);
        $scope.currentratio.push([$scope.result[i].Year, $scope.result[i].CR]);
        $scope.fixedassetturnover.push([$scope.result[i].Year, $scope.result[i].FAT]);
        $scope.netprofitmargin.push([$scope.result[i].Year, $scope.result[i].NPM]);
        $scope.returnonasset.push([$scope.result[i].Year, $scope.result[i].ROA]);
        $scope.returnonequity.push([$scope.result[i].Year, $scope.result[i].ROE]);
        $scope.returnoncommonequity.push([$scope.result[i].Year, $scope.result[i].ROCE]);
        $scope.debttoequity.push([$scope.result[i].Year, $scope.result[i].DTE]);
        $scope.debttototalasset.push([$scope.result[i].Year, $scope.result[i].DTTA]);
        $scope.freeflowcashratio.push([$scope.result[i].Year, $scope.result[i].FCR]);
        $scope.cashflowmargin.push([$scope.result[i].Year, $scope.result[i].CFM]);
        $scope.cashflowcoverage.push([$scope.result[i].Year, parseInt($scope.result[i].CFC, 10)]);
        $scope.periodticks[i] = $scope.result[i].Year;

    }

    //

    $scope.getSummary = function () {
        //PullSummary
        var analysisId = $scope.result[0].AnalysisId;
        var searchUrl = $scope.serviceURL + "/PullSummary"
        var datatosend = {analysisid: analysisId};
        $.ajax({
            url: searchUrl, type: "POST",
            dataType: "json",
            crossDomain: true,
            ifModified: true,
            cache: true,
            data: JSON.stringify(datatosend),
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                return true;
            }
        }).done(function (results) {

            $scope.summary = results.d.split("***");
            $scope.liquidity_report = JSON.parse($scope.summary[0])[0];
            $scope.profitability_report = JSON.parse($scope.summary[1])[0];
            $scope.activity_report = JSON.parse($scope.summary[2])[0];
            $scope.leverage_report = JSON.parse($scope.summary[3])[0];

            $scope.fcr_report = JSON.parse($scope.summary[4])[0];
            $scope.cfm_report = JSON.parse($scope.summary[5])[0];
            $scope.cfc_report = JSON.parse($scope.summary[6])[0];

            console.log($scope.leverage_report);
            $scope.$apply();
        }
        ).fail(function (jpXHR, textStatus, thrownError) {
            alert('An error occurred, please try again later.');
            console.log("--------------------");
            console.log(textStatus);
            console.log(jpXHR);
            console.log(thrownError);
            console.log("--------------------");
        }
        );
    }

    $scope.plotcashflowcoverage = function () {
        $.plot($("#cashflowcoverage-chart"), [{
            data: $scope.cashflowcoverage,
            label: "Cash Flow Coverage",
            lines: {
                fill: true
            }
        }
        ],
        {
            series: {
                lines: {
                    show: true,
                    fill: false
                },
                points: $scope.chartpoints,
                shadowSize: 0
            },
            grid: $scope.chartgrid,
            colors: [ "#424F63"],
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false
            },
            xaxis: {
                // mode: "time"
                ticks: $scope.periodticks
            },
            yaxes: [{
                /* First y axis */
            }, {
                /* Second y axis */
                position: "right" /* left or right */
            }]
        }
        );
    }


    $scope.plotcashflowmargin = function () {
        $.plot($("#cashflowmargin-chart"), [{
            data: $scope.cashflowmargin,
            label: "Cash Flow Margin",
            lines: {
                fill: true
            }
        }
        ],
        {
            series: {
                lines: {
                    show: true,
                    fill: false
                },
                points: $scope.chartpoints,
                shadowSize: 0
            },
            grid: $scope.chartgrid,
            colors: ["#e1003a", "#424F63"],
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false
            },
            xaxis: {
                // mode: "time"
                ticks: $scope.periodticks
            },
            yaxes: [{
                /* First y axis */
            }, {
                /* Second y axis */
                position: "right" /* left or right */
            }]
        }
        );
    }



    $scope.plotfreecashflow = function () {
        $.plot($("#freecashflow-chart"), [{
            data: $scope.freeflowcashratio,
            label: "Free Cash Flow",
            lines: {
                fill: true
            }
        }
        ],
        {
            series: {
                lines: {
                    show: true,
                    fill: false
                },
                points: $scope.chartpoints,
                shadowSize: 0
            },
            grid: $scope.chartgrid,
            colors: ["#e1003a", "#424F63"],
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false
            },
            xaxis: {
                // mode: "time"
                ticks: $scope.periodticks
            },
            yaxes: [{
                /* First y axis */
            }, {
                /* Second y axis */
                position: "right" /* left or right */
            }]
        }
        );
    }
    $scope.plotactivity = function () {

        $.plot($("#activity-chart"), [{
            data: $scope.fixedassetturnover,
            label: "Fixed Asset Turnover",
            lines: {
                fill: true
            }
        }
        ],
{
    series: {
        lines: {
            show: true,
            fill: false
        },
        points: $scope.chartpoints,
        shadowSize: 0
    },
    grid: $scope.chartgrid,
    colors: ["#e1003a", "#424F63"],
    tooltip: true,
    tooltipOpts: {
        defaultTheme: false
    },
    xaxis: {
        // mode: "time"
        ticks: $scope.periodticks
    },
    yaxes: [{
        /* First y axis */
    }, {
        /* Second y axis */
        position: "right" /* left or right */
    }]
}
);
    }
    
    $scope.plotleverage = function () {

        $.plot($("#leverage-chart"), [{
            data: $scope.debttoequity,
            label: "Debt To Equity",
            lines: {
                fill: true
            }
        }, {
            data: $scope.debttototalasset,
            label: "Debt to Total Asset",

            points: {
                show: true
            },
            lines: {
                show: true
            },
            yaxis: 2
        }
        ],
{
    series: {
        lines: {
            show: true,
            fill: false
        },
        points: {
            show: true,
            lineWidth: 2,
            fill: true,
            fillColor: "#ffffff",
            symbol: "circle",
            radius: 5
        },
        shadowSize: 0
    },
    grid: {
        hoverable: true,
        clickable: true,
        tickColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#eeeeee"
    },
    colors: ["#e1003a", "#424F63"],
    tooltip: true,
    tooltipOpts: {
        defaultTheme: false
    },
    xaxis: {
        // mode: "time"
        ticks: $scope.periodticks
    },
    yaxes: [{
        /* First y axis */
    }, {
        /* Second y axis */
        position: "right" /* left or right */
    }]
}
);
    }

      $scope.plotprofitability = function () {

        $.plot($("#profitability-chart"), [{
            data: $scope.netprofitmargin,
            label: "Net Profit Margin",
            lines: {
                fill: true
            }
        }, {
            data: $scope.returnonasset,
            label: "Return on Assets",

            points: {
                show: true
            },
            lines: {
                show: true
            },
            yaxis: 2
        }, {
            data: $scope.returnonequity,
            label: "Return on Equity",

            points: {
                show: true
            },
            lines: {
                show: true
            },
            yaxis: 2
        }, {
            data: $scope.returnoncommonequity,
            label: "Return on Common Equity",

            points: {
                show: true
            },
            lines: {
                show: true
            },
            yaxis: 2
        }
        ],
    {
        series: {
            lines: {
                show: true,
                fill: false
            },
            points: {
                show: true,
                lineWidth: 2,
                fill: true,
                fillColor: "#ffffff",
                symbol: "circle",
                radius: 5
            },
            shadowSize: 0
        },
        grid: {
            hoverable: true,
            clickable: true,
            tickColor: "#f9f9f9",
            borderWidth: 1,
            borderColor: "#eeeeee"
        },
        colors: ["#65CEA7", "#424F63", "#e1003a"],
        tooltip: true,
        tooltipOpts: {
            defaultTheme: false
        },
        xaxis: {
            // mode: "time"
            ticks: $scope.periodticks
        },
        yaxes: [{
            /* First y axis */
        }, {
            /* Second y axis */
            position: "right" /* left or right */
        }]
    }
);
    }
	
	

    $(document).ready(function () {

        $(".coolscroll").niceScroll({ styler: "fb", cursorcolor: "#e1003a", cursorwidth: '6', cursorborderradius: '0px', background: '#424f63', spacebarenabled: false, cursorborder: '0' });
        $('.toggle-btn').trigger('click');

        $scope.getSummary();

        $.plot($("#liquidity-chart"), [{
            data: $scope.quickratio,
            label: "Quick Ratio",
            lines: {
                fill: true
            }
        }, {
            data: $scope.currentratio,
            label: "Current Ratio",

            points: {
                show: true
            },
            lines: {
                show: true
            },
            yaxis: 2
        }
        ],
            {
                series: {
                    lines: {
                        show: true,
                        fill: false
                    },
                    points: {
                        show: true,
                        lineWidth: 2,
                        fill: true,
                        fillColor: "#ffffff",
                        symbol: "circle",
                        radius: 5
                    },
                    shadowSize: 0
                },
                grid: {
                    hoverable: true,
                    clickable: true,
                    tickColor: "#f9f9f9",
                    borderWidth: 1,
                    borderColor: "#eeeeee"
                },
                colors: ["#65CEA7", "#424F63"],
                tooltip: true,
                tooltipOpts: {
                    defaultTheme: false
                },
                xaxis: {
                    // mode: "time"
                    ticks: $scope.periodticks
                },
                yaxes: [{
                    /* First y axis */
                }, {
                    /* Second y axis */
                    position: "right" /* left or right */
                }]
            }
        );

        $scope.plotprofitability();
        $scope.plotleverage();
        $scope.plotactivity();
        $scope.plotfreecashflow();
        $scope.plotcashflowmargin();
        $scope.plotcashflowcoverage();
    });
	
  
	
	// ------------------
	$scope.formatCurrency = function()
	{
		var DecimalSeparator = Number("1.2").toLocaleString().substr(1,1);
		var AmountWithCommas = Amount.toLocaleString();
		var arParts = String(AmountWithCommas).split(DecimalSeparator);
		var intPart = arParts[0];
		var decPart = (arParts.length > 1 ? arParts[1] : '');
		decPart = (decPart + '00').substr(0,2);
		
		return '=N= ' + intPart + DecimalSeparator + decPart;
	}
	//-----------------------------------------------------
	
	
		
		////------------------------------------------------
		
		
		
		$.getScript( "../plugin/chosen/chosen.jquery.min.js", function( data, textStatus, jqxhr ) {
		  console.log( "Chosen Load was performed." );
		  
		  $.getScript( "../plugin/chosen/docsupport/prism.js", function( data, textStatus, jqxhr ) {
		  console.log( "Prism Load was performed." );
			  var config = {
					'.chosen-select': { display_selected_options: false },
					'.chosen-select-deselect': { allow_single_deselect: true },
					'.chosen-select-no-single': { disable_search_threshold: 10 },
					'.chosen-select-no-results': { no_results_text: 'Oops, nothing found!' },
					'.chosen-select-width': { width: "95%" }
				}
				for (var selector in config) {
					$(selector).chosen(config[selector]);
				}//$('.my_select_box').trigger('chosen:updated');
			});
	}); 
	
	
	
	
	
	//-----------------------------------------------------
	

	
	
	

}