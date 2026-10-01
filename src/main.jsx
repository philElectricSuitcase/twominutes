import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import emailjs from '@emailjs/browser';
import {
	ArrowDown, ArrowRight, Brain, Check, ChevronDown, Clock3, Heart,
	Mail, Menu, MoonStar, Sparkles, Target, X
} from 'lucide-react';
import profileImage from './images/profile.jpg';
import methodImage from './images/method.jpg';
import './styles.css';



const benefits = [
	{ icon: Target, number: '01', title: 'Move towards your goals', text: 'Turn a broad ambition into one small, useful action you can take today.' },
	{ icon: Brain, number: '02', title: 'Change your focus', text: 'Interrupt the mental loop and give your attention somewhere more constructive to land.' },
	{ icon: MoonStar, number: '03', title: 'Reduce anxiety', text: 'Create a little space between the thought, the feeling and what you choose to do next.' },
	{ icon: Heart, number: '04', title: 'Improve your self-love', text: 'Practise speaking to yourself with the patience you so readily offer other people.' }
];

const days = [
	{ day: 'MON', title: 'Set the direction', text: 'Begin with intention, not urgency.' },
	{ day: 'TUE', title: 'Notice the pattern', text: 'See what your thoughts are rehearsing.' },
	{ day: 'WED', title: 'Make some space', text: 'Pause in the middle of the noise.' },
	{ day: 'THU', title: 'Choose differently', text: 'Turn awareness into a small action.' },
	{ day: 'FRI', title: 'Keep what helped', text: 'Finish the week with perspective.' }
];

const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || import.meta.env.REACT_APP_EMAILJS_SERVICE_ID;
const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || import.meta.env.REACT_APP_EMAILJS_TEMPLATE_ID;



const Brand = () => (
	<a className="brand" href="#top" aria-label="Two Minutes home">
		<span className="brand-clock"><span>2</span></span>
		<span className="brand-copy"><strong>TWO MINUTES</strong><small>BY THOUGHT READER</small></span>
	</a>
);

const Navigation = () => {
	const [isOpen, setIsOpen] = useState(false);
	const links = [ [ 'Why it works', '#why' ], [ 'The week', '#week' ], [ 'The method', '#method' ] ];

	return <header className="nav-wrap">
		<div className="nav container">
			<Brand />
			<nav className="desktop-nav" aria-label="Main navigation">
				{links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
				<a className="nav-cta" href="#signup"><Mail size={16} /> Sign up free</a>
			</nav>
			<button className="menu-button" type="button" aria-label={isOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
		</div>
		{isOpen ? <nav className="mobile-nav" aria-label="Mobile navigation">{links.map(([label, href]) => <a href={href} key={href} onClick={() => setIsOpen(false)}>{label}</a>)}<a href="#signup" onClick={() => setIsOpen(false)}>Sign up free <ArrowRight size={16} /></a></nav> : null}
	</header>;
};

const SignupForm = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [feedback, setFeedback] = useState({ error: false, message: '' });

	const handleSubmit = async (event) => {
		event.preventDefault();
		setFeedback({ error: false, message: '' });
		const form = event.currentTarget;

		if(!emailjsPublicKey || !emailjsServiceId || !emailjsTemplateId) {
			setFeedback({ error: true, message: 'The email service is not configured yet. Please try again later.' });
			return;
		}

		setIsSubmitting(true);
		const formData = new FormData(form);
		const templateParams = {
			first_name: formData.get('firstName'),
			last_name: formData.get('lastName'),
			email: formData.get('email'),
			service: formData.get('service'),
			message: formData.get('message'),
			from_name: `${formData.get('firstName')} ${formData.get('lastName')}`.trim(),
			reply_to: formData.get('email')
		};

		try {
			await emailjs.send(emailjsServiceId, emailjsTemplateId, templateParams, { publicKey: emailjsPublicKey });
			form.reset();
			setFeedback({ error: false, message: 'You’re on the list. Your first Two Minutes message will arrive on a weekday.' });
		} catch(error) {
			setFeedback({ error: true, message: 'Something went wrong while signing you up. Please try again in a moment.' });
		} finally {
			setIsSubmitting(false);
		}
	};

	return <form className="signup-form" onSubmit={handleSubmit}>
		<div className="field-row">
			<label>First name<input name="firstName" autoComplete="given-name" required /></label>
			<label>Last name<input name="lastName" autoComplete="family-name" required /></label>
		</div>
		<label>Email address<input name="email" type="email" autoComplete="email" required /></label>
		<label>What would you most like help with?
			<select name="service" defaultValue="">
				<option value="" disabled>Choose a focus</option>
				<option>Achieving my goals</option>
				<option>Changing my focus</option>
				<option>Reducing anxiety</option>
				<option>Improving self-love</option>
				<option>A little of everything</option>
			</select>
		</label>
		<label>Anything you’d like Phil to know? <span>(optional)</span><textarea name="message" rows="3" /></label>
		<label className="consent"><input type="checkbox" required /><span>I’d like to receive Two Minutes weekday emails. I can unsubscribe at any time.</span></label>
		<button className="button primary wide" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing you up...' : 'Start my Two Minutes'} <ArrowRight size={18} /></button>
		{feedback.message ? <p className={feedback.error ? 'form-feedback error' : 'form-feedback'} role="status" aria-live="polite">{feedback.message}</p> : null}
	</form>;
};

const App = () => <div id="top">
	<Navigation />
	<main>
		<section className="hero">
			<img className="hero-photo" src={profileImage} alt="Phil Macleod, founder of Thought Reader" />
			<div className="hero-shade" />
			<div className="container hero-inner">
				<div className="hero-copy">
					<span className="kicker"><Sparkles size={16} /> The cornerstone of the Thought Reader Method</span>
					<h1>Two minutes.<br /><em>One meaningful shift.</em></h1>
					<p>A short message of mindfulness, delivered every weekday, to help you move towards your goals, change your focus, reduce anxiety and build a kinder relationship with yourself.</p>
					<div className="hero-actions"><a className="button primary" href="#signup">Start your weekday reset <ArrowRight size={18} /></a><a className="button ghost-light" href="#why">See how it works <ArrowDown size={18} /></a></div>
					<div className="hero-note"><Clock3 size={18} /><span><strong>Free. Monday to Friday.</strong> Read it in less time than it takes to make a cup of tea.</span></div>
				</div>
			</div>
		</section>

		<section className="promise-bar"><div className="container"><span>A PAUSE</span><i /> <span>A THOUGHT</span><i /> <span>A PRACTICE</span><i /> <span>A DIFFERENT DAY</span></div></section>

		<section className="section intro" id="why">
			<div className="container intro-grid">
				<div className="section-heading"><span className="eyebrow">SMALL ENOUGH TO DO. USEFUL ENOUGH TO MATTER.</span><h2>You do not always need a new plan. Sometimes, you need a new thought.</h2></div>
				<div className="intro-copy"><p>Most change is not made in one dramatic moment. It is made in the quiet seconds when you notice what is happening and choose your next response.</p><p>Two Minutes gives you one clear prompt each weekday. No long lessons. No pressure to be perfect. Just something practical to think about, try or carry into the rest of your day.</p></div>
			</div>
			<div className="container benefit-grid">{benefits.map(({ icon: Icon, number, title, text }) => <article className="benefit" key={number}><div className="benefit-head"><span>{number}</span><Icon /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
		</section>

		<section className="section week" id="week">
			<div className="container">
				<div className="week-heading"><div><span className="eyebrow">A RHYTHM FOR REAL LIFE</span><h2>Five small pauses.<br />One more intentional week.</h2></div><p>Your message meets you where you are. Each one takes around two minutes to read, reflect on and put into practice.</p></div>
				<div className="day-list">{days.map((item, index) => <article className="day" key={item.day}><span className="day-index">0{index + 1}</span><strong>{item.day}</strong><div><h3>{item.title}</h3><p>{item.text}</p></div><Check /></article>)}</div>
			</div>
		</section>

		<section className="sample section-dark">
			<div className="container sample-grid">
				<div className="sample-label"><span className="eyebrow light">A TWO MINUTES THOUGHT</span><span>01:42 READ</span></div>
				<blockquote>“You do not have to solve the whole day right now. Choose the next kind thing, the next useful thing, or simply the next thing. Then begin there.”</blockquote>
				<div className="sample-action"><span>Today’s practice</span><p>Before your next task, take one slow breath and ask: <strong>what would make this feel one degree easier?</strong></p></div>
			</div>
		</section>

		<section className="section method" id="method">
			<div className="container method-grid">
				<div className="method-image-wrap"><img src={methodImage} alt="Phil Macleod sharing the Thought Reader Method" /><span>20+ YEARS OF CLIENT WORK</span></div>
				<div className="method-copy"><span className="eyebrow">THE THOUGHT READER METHOD</span><h2>A daily expression of a much bigger idea.</h2><p>Created by Phil Macleod, Two Minutes is the cornerstone of the Thought Reader Method: the belief that meaningful change starts by becoming aware of the thoughts shaping how you feel and what you do.</p><p>Drawing on more than 20 years of work in hypnotherapy, mindfulness, coaching and behaviour change, each message makes that work simple enough to use in the middle of an ordinary day.</p><div className="method-points"><span><Check />Practical, not preachy</span><span><Check />Warm, not overwhelming</span><span><Check />Made for everyday life</span></div><a className="text-link" href="https://www.thought-reader.co.uk" target="_blank" rel="noreferrer">Discover Thought Reader <ArrowRight size={17} /></a></div>
			</div>
		</section>

		<section className="section signup" id="signup">
			<div className="container signup-grid">
				<div className="signup-copy"><span className="eyebrow light">YOUR NEXT TWO MINUTES</span><h2>Start tomorrow with something worth thinking about.</h2><p>Join the weekday list for a short, thoughtful message from Phil. Free to receive, easy to read, and yours to use in whatever way helps.</p><div className="signup-points"><span><Check />One email each weekday</span><span><Check />No weekend emails</span><span><Check />Unsubscribe whenever you like</span></div></div>
				<SignupForm />
			</div>
		</section>

		<section className="section faq"><div className="container faq-grid"><div><span className="eyebrow">GOOD TO KNOW</span><h2>A few simple answers.</h2></div><div>{[
			[ 'When will I receive the messages?', 'Messages are sent once a day from Monday to Friday. You will not receive Two Minutes emails at weekends.' ],
			[ 'Is Two Minutes really free?', 'Yes. There is no charge to join the weekday email list.' ],
			[ 'What will the messages cover?', 'The messages explore goals, focus, anxiety, self-love, perspective and the small thought patterns that shape everyday life.' ],
			[ 'Is this therapy?', 'No. Two Minutes supports everyday reflection and personal development, but it is not therapy or a substitute for medical or mental-health care.' ]
		].map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown /></summary><p>{answer}</p></details>)}</div></div></section>
	</main>
	<footer><div className="container footer-main"><Brand /><p>Two Minutes is part of the Thought Reader Method by Phil Macleod.</p><a href="#signup">Join the weekday list <ArrowRight size={16} /></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Thought Reader</span><span>Mindfulness for everyday change.</span></div></footer>
</div>;



createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);