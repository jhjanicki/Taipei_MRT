function initLineChart(){

  const bgData = [
    { period: "Cambrian", y1: -530, y2: -485.4 },
    { period: "Ordovician", y1: -485.4, y2: -443.4 },
    { period: "Silurian", y1: -443.4, y2: -419.2 },
    { period: "Devonian", y1: -419.2, y2: -358.9 },
    { period: "Carboniferous", y1: -358.9, y2: -298.9 },
    { period: "Permian", y1: -298.9, y2: -252.17 },
    { period: "Triassic", y1: -252.17, y2: -201.3 },
    { period: "Jurassic", y1: -201.3, y2: -145 },
    { period: "Cretaceous", y1: -145, y2: -66 },
    { period: "Paleogene", y1: -66, y2: -23.03 },
    { period: "Neogene", y1: -23.03, y2: -2.588 },
    { period: "Quaternary", y1: -2.588, y2: 0 },
  ];


  const yGridlines = Array.from({ length: 20 }, (v, k) => k+1).filter(number => number % 2 == 0);

  const margin = { top: 60, right: 150, bottom:40, left: 80 };
  const width = $("#chart2").parent().width() - margin.left - margin.right;
  const height = 2000 - margin.top - margin.bottom;

  const svg = d3
    .select("#chart2")
    .append("svg")
    .attr("id","svgLine")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xScale = d3
    .scaleLinear()
    .domain([0, 20])
    .range([margin.left, width]);

  const yScale = d3
    .scaleLinear()
    .domain([-530, 0])
    .range([margin.top, height]);

  const xAxisLine = svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(xScale));

  const yAxisLine = svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).tickFormat((d) => Math.abs(d) + " MYA"));


    svg.selectAll(".x-axis .tick text")
    .style("font-size",14)

    svg.selectAll(".y-axis .tick text")
  .style("font-size",14)

  const title = svg
    .append("g")
    .attr("class", "title")
    .attr("transform", `translate(${margin.left - 5},${margin.top - 40})`)
    .append("text")
    .style("font-size", 20)
    .text("Extinction rate (Number of families per million years)");

  const bg = svg
    .append("g")
    .attr("id", "bgG")
    .attr("transform", `translate(0,${margin.top})`);

  bg.selectAll("rect.bg")
    .data(bgData)
    .join("rect")
    .attr("class", "bg")
    .attr("width", width - margin.left)
    .attr("height", (d) => yScale(d.y2) - yScale(d.y1))
    .attr("x", margin.left)
    .attr("y", (d) => yScale(d.y1) - margin.top)
    .attr("fill", (d, i) => (i % 2 == 0 ? "#d9d9d9" : "#f0f0f0"))
    .attr("opacity", 0.75);

  bg.selectAll("text.period")
    .data(bgData)
    .join("text")
    .attr("class", "period")
    .attr("x", margin.left + 4)
    .attr("y", (d) => yScale(d.y1) - margin.top + 18)
    .attr("fill", "gray")
    .style("font-size",20)
    .style("font-family",'Source Sans Pro')
    .style("text-transform","uppercase")
    .text((d) => d.period);

  const gridlines = svg
    .append("g")
    .attr("id", "gridlinesG")
    .attr("transform", `translate(0,${margin.top})`);

  gridlines.selectAll("line.gridline")
  .data(yGridlines).join("line")
  .attr("class","gridline")
  .attr("x1",d=>xScale(d))
  .attr("y1",0)
  .attr("x2",d=>xScale(d))
  .attr("y2", height-margin.top)
  .attr("fill","none")
  .attr("stroke","gray")
  .attr("stroke-width",0.5)
  .attr("stroke-dasharray",5.5)

   extinctionEvents.map(function (d) {
    d.x = xScale(d.x);
    d.y = yScale(d.y);
  });


  svg.append("path")
      .datum(extinctionEvents)
      .attr("class","theLine")
      .attr("fill", "none")
      .attr("stroke", "#CD7454")
      .attr("stroke-width", 2.5)
      .attr("stroke-linecap","round")
      .attr("stroke-linejoin","round")
      .attr("d", d3.line()
        .x(d=>d.x)
        .y(d=>d.y)
        .curve(d3.curveCatmullRom.alpha(0.1))
      )

  // svgLine
  //   .selectAll("circle")
  //   .data(extinctionEvents)
  //   .join("circle")
  //   .attr("class",(d,i)=>`circle circle${i}`)
  //   .attr("fill", "#fff")
  //   .attr("stroke", "#e34a33")
  //   .attr("stroke-width", 2)
  //   .attr("cx", (d) => d.x)
  //   .attr("cy", (d) => d.y)
  //   .attr("r", (d) => (d.y === height ? 0 : 3.5))
  //   .attr("opacity", 1);


  svg.append("circle")
    .attr("class","circle0")
    .attr("r",10)
    .attr("cx",xScale(5.25))
    .attr("cy",yScale(-530))
    .attr("fill","white")
    .attr("stroke","#CD7454")
    .attr("stroke-width",3)
    .style("visibility","hidden")

   // d3.select(".circle0").attr("r",20)


  const type = d3.annotationCalloutCircle;

  const annotations = [
    {
      note: {
        title: "End Ordovician",
        label: "86% species & 27% families extinct",
      },
      id:"event1",
      className: "events",
      x: xScale(19.5),
      y: yScale(-444),
      dy: 0,
      dx: 50,
      subject: {
        radius: 20,
      },
    },
    {
      note: {
        title: "Late Devoniann",
        label: "75% species & 19% families extinct",
      },
      id:"event2",
      className: "events",
      x: xScale(10),
      y: yScale(-359),
      dy: 0,
      dx: 50,
      subject: {
        radius: 20,
      },
    },
    {
      note: {
        title: "End Permian",
        label: "96% species & 57% families extinct",
      },
      id:"event3",
      className: "events",
      x: xScale(16),
      y: yScale(-252),
      dy: 0,
      dx: 50,
      subject: {
        radius: 20,
      },
    },
    {
      note: {
        title: "End Triassic",
        label: "80% species & 23% families extinct",
      },
      id:"event4",
      className: "events",
      x: xScale(11.5),
      y: yScale(-201),
      dy: 0,
      dx: 50,
      subject: {
        radius: 20,
      },
    },
    {
      note: {
        title: "End Cretaceous",
        label: "76% species & 17% families extinct",
      },
      id:"event5",
      className: "events",
      x: xScale(17),
      y: yScale(-66),
      dy: 0,
      dx: 50,
      subject: {
        radius: 20,
      },
    },
    {
      note: {
        title: "Sixth mass extinction??",
        label: "What % of species will go extinct?",
        wrap: 200,
      },
      id:"event6",
      className: "events",
      x: xScale(5), //was 3
      y: yScale(0),
      dy: 0,
      dx: 50,
      subject: {
        radius: 20,
      },
    },
  ];

  const makeAnnotations = d3
    .annotation()
    .type(type)
    .annotations(annotations);

    svg.append("g").attr("class", "annotation-group").call(makeAnnotations);



  const showCircle = gsap.timeline({
      defaults:{
          autoAlpha:1
      }
  })
  .to(".circle0",{},0);

  const showAnnotations = gsap.timeline({
      defaults:{
          autoAlpha:1
      }
  })
  .to(".annotations .events:first-child",{},0.86)
  .to(".annotations .events:nth-child(2)",{},1.95)
  .to(".annotations .events:nth-child(3)",{},3.05)
  .to(".annotations .events:nth-child(4)",{},3.85)
  .to(".annotations .events:nth-child(5)",{},6.52)
  .to(".annotations .events:nth-child(6)",{},9.8)


const main = gsap.timeline(
    {
        scrollTrigger: {
          trigger: "#svgLine",
          scrub: true,
          start: "50px 10%", //first trigger, second scroller
          end: "1900px 20%",
        }
      }
)
  .from(".theLine", {drawSVG: 0,duration:10},0)
  .to(".circle0",{motionPath:{
    path:".theLine",
    align:".theLine",
    alignOrigin:[0.5,0.5]
  }, duration:10},0)
  .add(showCircle,0)
  .add(showAnnotations,0)

}



