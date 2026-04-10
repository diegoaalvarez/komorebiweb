"use strict";

const page2 = document.getElementById("page2");
let inPage2 = false;

function switchPage() {
	const page1 = document.getElementById("page1");
	const body = document.getElementsByTagName("body")[0];
	document.getElementById("SwitchPageBtn").onclick= null;
	

	page1.classList.add("fade-out");
	body.classList.add("scrollBg")
	inPage2 = true;

	function page1Gone(e) {
		if (e.target !== page1) return; //Bubbling?

		page1.style.display = "none";
		page1.removeEventListener("animationend", page1Gone);
	}

	function page2Gone(e) {
		if (e.target !== page2) return;

		//body.classList.remove("scrollBg")
		page2.removeEventListener("animationend", page2Gone);
		window.getComputedStyle(document.querySelector("#page2"), "::before")
		.classList.add("fadeLoop");

	}

	page1.addEventListener("animationend", page1Gone, {once : true});
	
	setTimeout(() => {
		page2.style.display = "block";
		page2.classList.add("fade-in");
		page2.addEventListener("animationend", page2Gone, {once : true});
	}, 500);
	document.removeEventListener("mousemove", cursorFollow);
}

const cursorE = document.getElementById("cursorImg");
function cursorFollow(e){
	cursorE.style.left = `${e.clientX}px`;
	cursorE.style.top = `${e.clientY}px`;
}




//Executing section.
document.addEventListener("mousemove", cursorFollow);


const artDecoE = document.getElementById("ArtDeco");

function bgScrollUpdate(){
	let ratio = window.innerWidth / 1920;
	console.log(ratio);
	const offset = window.scrollY * -0.65*ratio;
	const offset2 = window.scrollY * -0.45*ratio;
	/* bgE.style.backgroundPosition = `0 ${offset2}px, 0 ${offset}px`; */
	document.body.style.setProperty("--page2-bg2-y", `${offset2}px`);
	document.body.style.setProperty("--page2-bg1-y", `${offset}px`);
	artDecoE.style.backgroundPosition= `0 ${offset}px`;
}
window.addEventListener("scroll", bgScrollUpdate);
window.addEventListener("resize", bgScrollUpdate);



//Home button animation.
const homeButton = document.getElementById("SwitchPageBtn");
function step() {
	const opacity = 0.5 + Math.random() * 0.5;
	const delay = 200 + 1000*(opacity*opacity-0.5);
	homeButton.style.opacity = opacity;
	if(!inPage2)
		setTimeout(step, delay);
}
step()



let triggered = false;
let lastScroll = 0;
window.addEventListener("scroll", () => {
    if (triggered) return;

    const current = window.scrollY;

    if (current > lastScroll && current > 600) {
        triggered = true;

        document.getElementById("target").scrollIntoView({
            behavior: "smooth"
        });
    }

    lastScroll = current;
});


let scrollingState = false;
function smoothScroll(targetY) {
	if(scrollingState)
		return;
	const duration = 800;
	const startY = window.scrollY;
	const diff = targetY - startY + 200;
	let startTime = null;

	function easeInOut(t) {
		return t < 0.5
			? 2 * t * t
			: 1 - Math.pow(-2 * t + 2, 2) / 2;
	}

	function step(timestamp) {
		if (!startTime) startTime = timestamp;

		const progress = (timestamp - startTime) / duration;
		const eased = easeInOut(Math.min(progress, 1));

		window.scrollTo(0, startY + diff * eased);
		bgScrollUpdate()

		if (progress < 1) {
			requestAnimationFrame(step);
		}
		else{
			scrollingState = false
		}
	}

	scrollingState = true;
	requestAnimationFrame(step);
}

function scrollToMarker(markerId){
	const element = document.getElementById(markerId);
	const rect = element.getBoundingClientRect();
	smoothScroll(rect.top + window.scrollY);
}

//Scroll to markers
const observer = new IntersectionObserver(
	(entries, obs) => {
		for(let entry of entries){
			if (entry.isIntersecting && entry.boundingClientRect.top > 0)
			{
				let element = entry.target;
				//obs.unobserve(element);
				//Scroll to element
				const rect = element.getBoundingClientRect();
				smoothScroll(rect.top + window.scrollY);
			}
		}
	},
	{
		root: null, //viewport
		rootMargin: "0px",
		scrollMargin: "0px",
		threshold: 0.1,
	}
);

document.addEventListener("DOMContentLoaded", function(){
	let scrollPoints = document.querySelectorAll(".scrollMarker");
	for (let e of scrollPoints)
		observer.observe(e);
});
