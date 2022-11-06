function initSpeciesGallery(){
    $(".stickyContainer .sticky-graphic").css("margin-top",window.innerHeight/2-$("#toughieGraphic img").height()/2+50) //+50 to make the label more centered
    $(".stickyContainer .sticky-text").css("margin-top",window.innerHeight/2-$("#toughieText").height()/2)

    ScrollTrigger.create({
        trigger: "#toughieContainer",
        // markers:true,
        start: "top top",
        end: "+=800",
        pin: true,
        pinSpacing: false
    });

    ScrollTrigger.create({
        trigger: '#toughieGraphic',
        start: 'top -20%',
        end: 'bottom top',
        onEnter: toughieDies
    })

    ScrollTrigger.create({
        trigger: "#marthaContainer",
        // markers:true,
        start: "top top",
        end: "+=800",
        pin: true,
        pinSpacing: false
    });

    ScrollTrigger.create({
        trigger: '#marthaGraphic',
        start: 'top -20%',
        end: 'bottom top',
        onEnter: marthaDies
    })
}

function toughieDies(){
    $("#frame1").css("opacity",1);
    $("#frog1").css("padding","120px");
    $("#frog1").css("opacity",0);
    $("#frog2").css("padding","120px"); // add transition & delay
    setTimeout(d=>{
        $("#frog2").css("opacity",1);
        $("#frog2").css("z-index",4);
    },1000);

    $("#toughieText").addClass("label")
    $("#toughieText p").html("He died in 2016.  Before that, a chytrid fungus wiped out the remaining populations of his species in the wild in Panama, along with many other amphibian species.  Though scientists were able to save several dozens of individuals back then, they didn’t manage to save the species.")
}

function marthaDies(){
    $("#frame2").css("opacity",1);
    $("#pidgeon1").css("padding","120px");
    $("#pidgeon1").css("opacity",0);
    $("#pidgeon2").css("padding","120px"); // add transition & delay
    setTimeout(d=>{
        $("#pidgeon2").css("opacity",1);
        $("#pidgeon2").css("z-index",4);
    },1000);

    $("#marthaText").addClass("label")
    $("#marthaText p").html("She died in 1914 at the Cincinnati zoo.  Her story is a cautionary tale for conservation: in the 1850s there were still millions of passenger pigeons, but they were eventually hunted to extinction, as conservation measures were taken when it was already beyond the point of no return. The last individual in the wild died in 1900.")
}