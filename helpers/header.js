var yearSelector = document.querySelector("select[name='select']");
yearSelector.addEventListener('change', function () {
    var selectedYear = yearSelector.value.split("-")[0];
    manager.triggerYearFilterEvent(selectedYear);
    
});

var yearsSelect = [ "2019",
                    "2018",
                    "2017",
                    "2016",
                    "2015",
                    "2014",
                    "2013",
                    "2012",
                    "2011",
                    "2010",
                    "2009",
                    "2008",
                    "2007",
                    "2006",
                    "2005",
                    "2004",
                    "2003",
                    "2002",
                    "2001",
                    "2000",
                    ]

var compareSelector = document.getElementById("compareCheck");

compareSelector.addEventListener("change", function(){
	if (manager.compareMode== false)
	{
		    manager.compareMode = true;

	}else
	{
		    manager.compareMode = false;
		    

	}
})



