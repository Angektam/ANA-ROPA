import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  
  // Counter Animation
  animateCounter(element: HTMLElement, start: number, end: number, duration: number = 2000) {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toString();
    }, 16);
  }

  // Reveal on Scroll Observer
  createRevealObserver(callback: (entry: IntersectionObserverEntry) => void) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, options);
  }

  // Stagger Animation
  staggerAnimation(elements: NodeListOf<Element>, delay: number = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-reveal');
      }, index * delay);
    });
  }

  // Parallax Effect
  initParallax(element: HTMLElement, speed: number = 0.5) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      element.style.transform = `translateY(${rate}px)`;
    });
  }

  // Smooth Scroll to Element
  smoothScrollTo(elementId: string, offset: number = 0) {
    const element = document.getElementById(elementId);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  }

  // Shake Animation for errors
  shakeElement(element: HTMLElement) {
    element.classList.add('animate-shake');
    setTimeout(() => {
      element.classList.remove('animate-shake');
    }, 500);
  }

  // Success Pulse
  successPulse(element: HTMLElement) {
    element.classList.add('animate-success-pulse');
    setTimeout(() => {
      element.classList.remove('animate-success-pulse');
    }, 1000);
  }
}

