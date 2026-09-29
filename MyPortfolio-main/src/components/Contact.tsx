import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.observe');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success/error
    if (Math.random() > 0.2) {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setSubmitStatus('error');
    }
    
    setIsSubmitting(false);

    // Reset status after 5 seconds
    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+92 325-1907930',
      link: 'tel:+923251907930',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'sanaullah786shah92@gmail.com',
      link: 'mailto:sanaullah786shah92@gmail.com',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Pakistan, ISB',
      link: '#',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: 'Chat with me',
      link: 'https://wa.me/923251907930',
      gradient: 'from-green-400 to-green-600'
    }
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-20 right-1/4 w-4 h-4 bg-purple-400 rounded-full animate-float"></div>
        <div className="absolute bottom-20 left-1/4 w-6 h-6 bg-pink-400 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 right-20 w-3 h-3 bg-blue-400 rounded-full animate-float animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="observe text-4xl md:text-5xl font-bold text-gray-800 mb-6 animate-text-shimmer bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto]">
            Let's Work Together
          </h2>
          <div className="observe w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8 animate-glow-pulse"></div>
          <p className="observe text-gray-600 max-w-2xl mx-auto text-lg animate-fade-in-up animation-delay-300">
            Have a project in mind? I'd love to hear from you. Send me a message and let's create something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Enhanced Contact Information */}
          <div className="observe space-y-8 animate-slide-in-left">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 hover-lift">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 relative">
                Get in Touch
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-500"></div>
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
                I'm always open to discussing new opportunities, creative ideas, or potential partnerships. 
                Don't hesitate to reach out if you'd like to connect!
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={item.title}
                    href={item.link}
                    target={item.link.startsWith('http') ? '_blank' : '_self'}
                    rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}
                    className="flex items-center space-x-4 group cursor-pointer p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-500 hover-lift"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`p-3 bg-gradient-to-r ${item.gradient} rounded-xl text-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl animate-glow-pulse`}>
                      <item.icon size={20} className="group-hover:animate-wiggle" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{item.value}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Enhanced Availability Status */}
              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-500">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-green-800 font-medium">Available for new projects</span>
                </div>
              </div>

              {/* WhatsApp Quick Action */}
              <div className="mt-6">
                <a
                  href="https://wa.me/923251907930"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl animate-bounce-in animation-delay-700"
                >
                  <MessageCircle size={20} className="group-hover:animate-wiggle" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form */}
          <div className="observe animate-slide-in-right">
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 hover-lift">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 peer group-hover:shadow-md"
                    placeholder=" "
                  />
                  <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    focusedField === 'name' || formData.name
                      ? '-top-2 text-xs bg-gray-50 px-2 text-purple-600'
                      : 'top-3 text-gray-500'
                  }`}>
                    Your Name
                  </label>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 peer group-hover:shadow-md"
                    placeholder=" "
                  />
                  <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    focusedField === 'email' || formData.email
                      ? '-top-2 text-xs bg-gray-50 px-2 text-purple-600'
                      : 'top-3 text-gray-500'
                  }`}>
                    Email Address
                  </label>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="mb-6 relative group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 peer group-hover:shadow-md"
                  placeholder=" "
                />
                <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  focusedField === 'subject' || formData.subject
                    ? '-top-2 text-xs bg-gray-50 px-2 text-purple-600'
                    : 'top-3 text-gray-500'
                }`}>
                  Subject
                </label>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              <div className="mb-6 relative group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none peer group-hover:shadow-md"
                  placeholder=" "
                ></textarea>
                <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  focusedField === 'message' || formData.message
                    ? '-top-2 text-xs bg-gray-50 px-2 text-purple-600'
                    : 'top-3 text-gray-500'
                }`}>
                  Your Message
                </label>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-500 flex items-center justify-center space-x-2 overflow-hidden ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-xl transform'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center space-x-2">
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={20} className="group-hover:animate-wiggle" />
                      <span>Send Message</span>
                    </>
                  )}
                </div>
              </button>

              {/* Enhanced Status Messages */}
              {submitStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 animate-slide-in-up">
                  <CheckCircle className="text-green-500 animate-bounce-gentle" size={20} />
                  <span className="text-green-800">Message sent successfully! I'll get back to you soon.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 animate-slide-in-up">
                  <AlertCircle className="text-red-500 animate-wiggle" size={20} />
                  <span className="text-red-800">Failed to send message. Please try again.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;