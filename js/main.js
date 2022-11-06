window.onload = (event) => {
    $("#header1").delay(1000).fadeOut(2500);
    $(".introTextWrapper").css("margin-top",$("#header1").height()+50)
    $(".introTextWrapper").css("opacity",1);
    $("body").css("opacity",1);
    $("body").css("visibility","visible");

    initSpeciesGallery();
    initLineChart();
    initSpeciesForce();


    gsap.utils.toArray(".comparisonSection").forEach(section => {
        let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "center center",
            // makes the height of the scrolling (while pinning) match the width, thus the speed remains constant (vertical/horizontal)
                    end: () => "+=" + section.offsetWidth,
                    scrub: true,
                    pin: true,
            anticipatePin: 1
                },
                defaults: {ease: "none"}
            });
        // animate the container one way...
        tl.fromTo(section.querySelector(".afterImage"), { xPercent: -100, x: 0}, {xPercent: 0})
        // ...and the image the opposite way (at the same time)
        .fromTo(section.querySelector(".afterImage img"), {xPercent: 100, x: 0}, {xPercent: 0}, 0);
    });

};



gsap.from($(".statistic"), {
        textContent: 0,
        duration: 4,
        ease: Power1.easeIn,
        snap: { textContent: 1 },
        stagger: 1,
        scrollTrigger: {
            trigger: ".animation",
            start: "10% top",
        }
    });