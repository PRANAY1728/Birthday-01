"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function BirthdayPage() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [noteIndex, setNoteIndex] = useState(0)
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  })

  const audioRef = useRef<HTMLAudioElement>(null)
  const slideInterval = useRef<NodeJS.Timeout>()

  const images = ["/images/image1.jpeg", "/images/image2.jpeg", "/images/image3.jpeg"]

  const specialNotes = [
    "You are the sunshine that brightens my darkest days. Your smile is the light that guides me home.",
    "Every moment with you feels like a beautiful dream I never want to wake up from.",
    "Your love is the greatest gift I've ever received. I cherish it every day.",
    "You make my heart skip a beat, today and always.",
    "I fall in love with you more and more each day.",
  ]

  useEffect(() => {
    // Start slideshow
    startSlideInterval()

    // Start note rotation
    const noteRotationInterval = setInterval(() => {
      setNoteIndex((prev) => (prev + 1) % specialNotes.length)
    }, 5000)

    // Update countdown
    const countdownInterval = setInterval(updateCountdown, 1000)

    // Create floating hearts
    createHearts()

    // Create confetti
    createConfetti()

    return () => {
      clearInterval(slideInterval.current)
      clearInterval(noteRotationInterval)
      clearInterval(countdownInterval)
    }
  }, [])

  const startSlideInterval = () => {
    clearInterval(slideInterval.current)
    slideInterval.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % images.length)
    }, 5000)
  }

  const changeSlide = (n: number) => {
    clearInterval(slideInterval.current)
    let newIndex = slideIndex + n

    if (newIndex >= images.length) {
      newIndex = 0
    } else if (newIndex < 0) {
      newIndex = images.length - 1
    }

    setSlideIndex(newIndex)
    startSlideInterval()
  }

  const currentSlide = (n: number) => {
    clearInterval(slideInterval.current)
    setSlideIndex(n)
    startSlideInterval()
  }

  const updateCountdown = () => {
    // Set the target date to Australian time (Sydney/Melbourne)
    const birthday = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" }))
    birthday.setHours(23, 59, 59)

    // Get current time in Australian time zone
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" }))
    const diff = birthday.getTime() - now.getTime()

    if (diff <= 0) {
      setCountdown({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      })
      return
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setCountdown({
      days: days.toString().padStart(2, "0"),
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    })
  }

  const createHearts = () => {
    const heartCount = 15

    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement("div")
      heart.className = "fixed bg-primary opacity-60 rotate-45 animate-float"

      // Random position
      heart.style.left = `${Math.random() * 100}vw`
      heart.style.top = `${Math.random() * 100}vh`

      // Random size
      const size = Math.random() * 15 + 10
      heart.style.width = `${size}px`
      heart.style.height = `${size}px`

      // Random animation duration
      heart.style.animationDuration = `${Math.random() * 6 + 4}s`

      // Random delay
      heart.style.animationDelay = `${Math.random() * 5}s`

      // Create before and after elements for heart shape
      const before = document.createElement("div")
      before.className = "absolute w-full h-full bg-primary rounded-full -top-1/2 left-0"

      const after = document.createElement("div")
      after.className = "absolute w-full h-full bg-primary rounded-full top-0 -left-1/2"

      heart.appendChild(before)
      heart.appendChild(after)

      document.body.appendChild(heart)
    }
  }

  const createConfetti = () => {
    const colors = ["#ff6b95", "#ffd3e1", "#ff4778", "#ffb3c6", "#ffffff"]

    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div")
        confetti.className = "fixed w-2.5 h-2.5 -z-10"
        confetti.style.animation = "confetti-fall linear forwards"

        // Random position
        confetti.style.left = `${Math.random() * 100}vw`

        // Random size
        const size = Math.random() * 8 + 5
        confetti.style.width = `${size}px`
        confetti.style.height = `${size}px`

        // Random color
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)]

        // Random shape
        const shapes = ["circle", "square", "triangle"]
        const shape = shapes[Math.floor(Math.random() * shapes.length)]

        if (shape === "circle") {
          confetti.style.borderRadius = "50%"
        } else if (shape === "triangle") {
          confetti.style.width = "0"
          confetti.style.height = "0"
          confetti.style.background = "transparent"
          confetti.style.borderLeft = `${size / 2}px solid transparent`
          confetti.style.borderRight = `${size / 2}px solid transparent`
          confetti.style.borderBottom = `${size}px solid ${colors[Math.floor(Math.random() * colors.length)]}`
        }

        // Random animation duration
        const duration = Math.random() * 3 + 2
        confetti.style.animationDuration = `${duration}s`

        document.body.appendChild(confetti)

        // Remove confetti after animation
        setTimeout(() => {
          confetti.remove()
        }, duration * 1000)
      }, Math.random() * 2000)
    }
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
      }
      setIsMusicPlaying(!isMusicPlaying)
    }
  }

  const playVideo = () => {
    // Replace with your video URL
    window.open("your_video_link.mp4", "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 to-rose-200">
      <div
        className="fixed bottom-5 right-5 w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg z-50 transition-all duration-300 hover:scale-110"
        onClick={toggleMusic}
      >
        <span className="text-white text-xl">{isMusicPlaying ? "♫" : "♪"}</span>
      </div>

      <div className="text-center py-10 px-4 animate-[fadeIn_1s_ease-in-out]">
        <h1
          className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-2 drop-shadow-lg animate-[heartbeat_1.5s_ease-in-out_infinite]"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Happy Birthday, My Love! 🎉💟
        </h1>
        <p className="text-white text-lg md:text-xl opacity-90 mb-4">Celebrating the most special person in my life</p>
      </div>

      <Card className="max-w-3xl mx-auto mb-12 bg-white/95 p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden animate-[slideUp_1s_ease-in-out]">
        <div className="text-base md:text-lg leading-relaxed mb-8 px-2 text-center">
          <p>
            I might not know how to express this perfectly, but I want you to know that you are a{" "}
            <span className="text-primary font-semibold">special person</span> in my life. No matter what happens, I
            will always be by your side throughout my journey. You are the one who brings me{" "}
            <span className="text-primary font-semibold">joy every single day</span>. I promise that I will never let
            you down, and I will stand by you during difficult times.
          </p>
          <p>
            <span className="text-primary font-semibold">Happy Birthday Preethi Bangaram</span> 💟💟
          </p>
        </div>

        <div className="relative w-full mb-8 rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: "4/3" }}>
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-1000 ${index === slideIndex ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={img || "/placeholder.svg"}
                alt={`Our Beautiful Memory ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}

          <div
            className="absolute top-1/2 -translate-y-1/2 bg-black/30 text-white w-10 h-10 flex items-center justify-center cursor-pointer rounded-full z-10 transition-all duration-300 hover:bg-black/60 left-3"
            onClick={() => changeSlide(-1)}
          >
            ❮
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 bg-black/30 text-white w-10 h-10 flex items-center justify-center cursor-pointer rounded-full z-10 transition-all duration-300 hover:bg-black/60 right-3"
            onClick={() => changeSlide(1)}
          >
            ❯
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${index === slideIndex ? "bg-white scale-125" : "bg-white/50"}`}
                onClick={() => currentSlide(index)}
              ></div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 my-6 flex-wrap">
          <div className="flex flex-col items-center bg-white p-3 rounded-xl min-w-[70px] shadow-md">
            <span className="text-2xl font-bold text-primary">{countdown.days}</span>
            <span className="text-xs text-gray-500 uppercase">Days</span>
          </div>
          <div className="flex flex-col items-center bg-white p-3 rounded-xl min-w-[70px] shadow-md">
            <span className="text-2xl font-bold text-primary">{countdown.hours}</span>
            <span className="text-xs text-gray-500 uppercase">Hours</span>
          </div>
          <div className="flex flex-col items-center bg-white p-3 rounded-xl min-w-[70px] shadow-md">
            <span className="text-2xl font-bold text-primary">{countdown.minutes}</span>
            <span className="text-xs text-gray-500 uppercase">Minutes</span>
          </div>
          <div className="flex flex-col items-center bg-white p-3 rounded-xl min-w-[70px] shadow-md">
            <span className="text-2xl font-bold text-primary">{countdown.seconds}</span>
            <span className="text-xs text-gray-500 uppercase">Seconds</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-secondary to-white/90 p-6 rounded-xl my-8 relative shadow-md animate-[pulse_2s_infinite]">
          <p
            className="text-xl md:text-2xl font-medium leading-relaxed text-primary text-center"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            {specialNotes[noteIndex]}
          </p>
        </div>

        <div className="flex gap-4 justify-center mt-8 flex-wrap">
          <Button
            variant="outline"
            className="bg-white text-primary border-2 border-primary py-3 px-6 text-base font-semibold rounded-xl cursor-pointer shadow-md transition-all duration-300 flex items-center gap-2 hover:bg-secondary hover:text-rose-600"
            onClick={() => alert("Gallery feature would display all your beautiful photos together!")}
          >
          </Button>
        </div>
      </Card>

      <div className="text-center py-5 text-white text-sm">
        <p>Made with ❤️ for the love of my life</p>
      </div>

      <audio ref={audioRef} loop>
        <source src="your_music_file.mp3" type="audio/mp3" />
      </audio>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: rotate(45deg) translateY(0); }
          50% { transform: rotate(45deg) translateY(-20px); }
        }
        
        @keyframes confetti-fall {
          0% { 
            transform: translateY(-100vh) rotate(0deg); 
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(360deg); 
            opacity: 0;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.1); }
          28% { transform: scale(1); }
          42% { transform: scale(1.1); }
          70% { transform: scale(1); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

