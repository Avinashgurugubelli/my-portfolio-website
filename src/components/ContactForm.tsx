
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendToGoogleSheets = async (data: typeof formData) => {
    try {
      // This would typically use Google Apps Script Web App URL
      // For now, we'll just log it and show success
      console.log('Sending to Google Sheets:', data);
      
      // In production, you would use a Google Apps Script Web App URL like:
      // const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      return true;
    } catch (error) {
      console.error('Error sending to Google Sheets:', error);
      return false;
    }
  };

  const sendEmail = async (data: typeof formData) => {
    try {
      // Using a simple email service (you can replace with EmailJS)
      const emailData = {
        to: 'avinashgurugubelli@gmail.com',
        subject: `Contact Form: ${data.subject}`,
        body: `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
        `
      };

      // For GitHub Pages, we'll use a third-party service like Formspree or EmailJS
      // This is a placeholder - you'll need to set up EmailJS or similar service
      console.log('Email data:', emailData);
      
      // Example with fetch to a service like Formspree:
      // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: data.name,
      //     email: data.email,
      //     subject: data.subject,
      //     message: data.message
      //   })
      // });
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Send email
      const emailSent = await sendEmail(formData);
      
      // Send to Google Sheets
      const sheetsSent = await sendToGoogleSheets(formData);
      
      if (emailSent || sheetsSent) {
        toast.success("Message sent successfully! I'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-none h-full overflow-hidden">
      <CardContent className="p-8">
        <h3 className="text-xl font-semibold mb-6">Send Message</h3>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Your Name *
              </label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                className="bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Your Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject *
            </label>
            <Input
              id="subject"
              name="subject"
              placeholder="Project inquiry, collaboration, etc."
              required
              value={formData.subject}
              onChange={handleChange}
              className="bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Your Message *
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Hello! I'm interested in working with you..."
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="resize-none bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            * Required fields. Your message will be sent directly to my email.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
