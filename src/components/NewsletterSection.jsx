import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Loader2 } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Oops!",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('/.netlify/functions/send-ebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Handle the response more robustly
      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (error) {
        // If the response is not JSON, we have a bigger server-side problem.
        // We will show the raw text for debugging, which is better than a crash.
        throw new Error(`The server returned an unexpected response. Please contact support. (Details: ${responseText.substring(0, 100)})`);
      }

      if (!response.ok) {
        // Use the error message from the server if available
        throw new Error(responseData.error || 'An unknown server error occurred.');
      }

      toast({
        title: "Success! 🎉",
        description: (
          <span>
            Your ebook is on its way! If it doesn't arrive soon, you can{' '}
            <a href="https://mindfulmanifestation.life/ebook.pdf" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-purple-600 hover:text-purple-800">
              download it directly here
            </a>
            .
          </span>
        ),
        variant: "success",
        duration: 10000,
      });
      setEmail('');

    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.message || "Failed to send the ebook. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="newsletter" className="section-padding bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Get Your Free Ebook
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Enter your email below to receive "The Mindful Manifestation Guide" and start your journey to abundance today!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-grow">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="email"
                placeholder="Your email address"
                className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 shadow-md text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address for ebook"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="btn-primary px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                'Get Free Ebook'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
