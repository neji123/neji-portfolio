/** Session key: set once the first-load intro has played in this tab. */
export const INTRO_KEY = "nb-intro-seen";

/**
 * Runs before the first paint (inline in <body>): the intro plays on the first page of a
 * visit only. A later load in the same tab marks it seen, and the CSS skips it.
 */
export const INTRO_GATE_SCRIPT = `try{var s=sessionStorage;if(s.getItem("${INTRO_KEY}"))document.documentElement.dataset.intro="seen";else s.setItem("${INTRO_KEY}","1")}catch(e){}`;
