function initSpeciesForce() {

  const width = d3.select("#chart1").node().getBoundingClientRect().width;
  const height = 700;
  const margin = {
      top: 50,
      right: 140,
      left: 100,
      bottom: 30,
  };

  const center = {
      x: width / 2,
      y: height / 2,
  };

  const species = [
      "amphibians",
      "birds",
      "mammals",
      "reptiles",
      "insects",
      "snails",
      "other invertebrates",
      "fish",
  ];

  const years = [
      ...new Set(extinctionData.map((item) => item.yearLastSeenClean)),
  ].sort();

  const x = d3
      .scaleLinear()
      .domain(d3.extent(years))
      .range([margin.left, width - margin.right]);
  const y = d3
      .scaleBand()
      .domain(species)
      .range([0, height - margin.top - margin.bottom]);
  const colorStatus = d3
      .scaleOrdinal()
      .domain(["clear", "unclear", "NA"])
      .range(["#5ab4ac", "#d8b365", "#999999"]);
  const colorTime = d3
      .scaleLinear()
      .domain([
          1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000,
      ])
      .range([
          "#e4cb99",
          "#d5b8a9",
          "#c4a5b2",
          "#b67a7d",
          "#b5aaa6",
          "#acc3c3",
          "#89aec1",
          "#7aa2c3",
          "#8a91c3",
          "#9484be",
      ]);

  const radius = 3;

  const forceStrength = 0.03;

  const xAxis = (g) =>
      g
      .call(
          d3.axisTop(x).tickFormat(function(d) {
              if (
                  d == "1500" ||
                  d == "1600" ||
                  d == "1700" ||
                  d == "1800" ||
                  d == "1900" ||
                  d == "2000"
              ) {
                  return d;
              }
          })
      )
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove());

  const yAxis = ((g) =>
      g
      .call(d3.axisLeft(y).ticks(8))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove()));

  const svg = d3
      .select("#chart1");


  let force = d3
      .forceSimulation(extinctionData)
      .force("charge", d3.forceManyBody().strength(0))
      .force("x", d3.forceX().strength(forceStrength).x(center.x))
      .force("y", d3.forceY().strength(forceStrength).y(center.y))
      .force("collision", d3.forceCollide().radius(radius + 3));

  const wrapper = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xaxis = wrapper
      .append("g")
      .attr("transform", `translate(0,0)`) //not sure why I need to do this to have it align
      .attr("class", "x-axis");

  const yaxis = wrapper.append("g").attr("class", "y-axis");

  const circlesG = wrapper.append("g").attr("class", "circlesG");

  circlesG
      .selectAll("circle")
      .data(extinctionData)
      .join("circle")
      .attr("class", "circles")
      .attr("r", 0)
      .attr("fill", (d) => colorTime(d.yearLastSeenClean))
      .attr("opacity", 0);

  force.on("tick", () => {
      d3.selectAll("circle.circles")
          .transition()
          .ease(d3.easeLinear)
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);
  });


  const NUM_ITERATIONS = 120;

  for (let i = 0; i < NUM_ITERATIONS; ++i) {
      force.tick();
  };

  d3.selectAll("circle.circles")
      .transition()
      .ease(d3.easeLinear)
      .attr("r", radius)
      .attr("opacity", 1);

  const splitCircles = () => {

      force.alpha(0.02);
      force
          .force(
              "x",
              d3.forceX().strength(1.4).x((d) => d.yearLastSeenRange === "NA" ? width / 5 * 1.5 - margin.left : width / 5 * 3.5 - margin.left)
          )
          .force(
              "y",
              d3.forceY().strength(1.4).y(height / 2)
          )
          .force("collision", d3.forceCollide().radius(radius + 2.5))
          .alphaDecay(0.015)


      d3.selectAll("circle.circles")
          .attr("fill", (d) => colorTime(d.yearLastSeenClean));

      force.restart(); //necessary

      for (let i = 0; i < NUM_ITERATIONS; ++i) {
          force.tick();
      };

  }


  const drawTimeline = () => {
      force.stop();
      // Add x-Axis
      xaxis
          .call(xAxis)
          .attr("opacity", 0)
          .transition()
          .duration(500)
          .attr("opacity", 1);

      yaxis
          .call(yAxis, y, species)
          .attr("opacity", 0)
          .transition()
          .duration(500)
          .attr("opacity", 1);

      const filteredData = extinctionData.filter(
          (d) => d.yearLastSeenRange !== "NA"
      );
      force = d3.forceSimulation(filteredData);

      force
          .force("charge", d3.forceManyBody().strength(0))
          .force(
              "x",
              d3.forceX().x((d) => x(d.yearLastSeenClean))
          )
          .force(
              "y",
              d3.forceY((d) => y(d.group_common_name) + y.bandwidth() / 2)
          )
          .force("collision", d3.forceCollide().radius(radius + 1));

      force.on("tick", () => {
          d3.selectAll("circle.circles")
              .transition()
              .ease(d3.easeLinear)
              .attr("cx", (d) => d.x)
              .attr("cy", (d) => d.y);
      });

      d3.selectAll("circle.circles")
          .data(filteredData)
          .join("circle")
          .attr("class", "circles")
          .attr("stroke-width", d => d.DataClear === "unclear" ? 0 : 1)
          .attr("stroke", d => d.DataClear === "unclear" ? "none" : "black")
          .attr("r", radius)
          .attr("fill", (d) => colorTime(d.yearLastSeenClean));

      force.restart();
  };

  const drawAnnotations = (filteredData) => {

      const annotationData = filteredData.map(function(d) {
          return {
              data: {
                  common_name: d.common_name,
                  x: d.x,
                  y: d.y
              },
              note: {
                  label: d.common_name,
                  align: "right",
                  orientation: "leftright",
                  wrap: 100,
                  padding: 0,
                  bgPadding: {
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0
                  },
                  lineType: "horizontal"
              },
              x: x(d.yearLastSeenClean),
              y: y(d.group_common_name) + y.bandwidth() / 2,
              dx: 20,
              dy: 20,
              type: d3.annotationCallout,
              connector: {
                  end: "arrow"
              },
              subject: {
                  radius: 5
              }
          }
      });

      // const type = d3.annotationCalloutCircle;

      const makeAnnotations = d3
          .annotation()
          // .type(type)
          .annotations(annotationData);

      circlesG.append("g").attr("class", "annotation-group").call(makeAnnotations);
  };


  // initialize the scrollama
  const scrollerForce = scrollama();
  let triggered = false;


  function handleStepEnterForce(response) {

      if (response.index == 1) {
          if (response.direction == "down") {
              if (!triggered) {
                  splitCircles();
              }
          }
      }

      if (response.index == 2) {
          if (response.direction == "down") {
              if (!triggered) {
                  drawTimeline();
                  triggered = true;
              }
          }
      }

      if (response.index == 3) {
          const filteredData = extinctionData.filter(
              (d) => d.common_name !== "NA" && d.common_name !== "Kauaʻi ʻōʻō" && d.common_name !== "Christmas Island pipistrelle" && d.common_name !== "Chiriqui Harlequin Frog" && d.common_name !== "Dodo"
          );
          if (response.direction == "down") {
              drawAnnotations(filteredData);
          }
      }

      if (response.index == 4) {
          const filteredData = extinctionData.filter(
              (d) => d.common_name === "Kauaʻi ʻōʻō" || d.common_name === "Dodo"
          );
          if (response.direction == "down") {
              drawAnnotations(filteredData);
          }
      }

      if (response.index == 5) {
          const filteredData = extinctionData.filter(
              (d) => d.common_name === "Chiriqui Harlequin Frog" || d.common_name === "Christmas Island pipistrelle"
          );
          if (response.direction == "down") {
              drawAnnotations(filteredData);
          }
      }

  }


  function init() {

      scrollerForce
          .setup({
              step: ".scrollerForce .scene",
              offset: 0.65,
              debug: false,
              progress: false,
          })
          .onStepEnter(handleStepEnterForce)
  }

  init();

}