
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFooterNavigation = (href: string) => {
    if (href.startsWith('/#')) {
      const sectionId = href.substring(2);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => scrollToSection(sectionId), 100);
      } else {
        scrollToSection(sectionId);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AG
              </span>
              <span className="text-xl font-semibold">Avinash</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Full Stack Developer passionate about creating innovative solutions and sharing knowledge through technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { name: 'About', href: '/#about' },
                { name: 'Experience', href: '/#experience' },
                { name: 'Projects', href: '/#projects' },
                { name: 'Skills', href: '/#skills' },
              ].map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleFooterNavigation(link.href)}
                  className="block text-muted-foreground hover:text-foreground transition-colors text-sm text-left"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Blog & Resources */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Resources</h3>
            <div className="space-y-2">
              {[
                { name: 'Blog Articles', href: '/blogs' },
                { name: 'Certifications', href: '/#certifications' },
                { name: 'Contact', href: '/#contact' },
              ].map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleFooterNavigation(link.href)}
                  className="block text-muted-foreground hover:text-foreground transition-colors text-sm text-left"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Social & Contact */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="space-y-2">
              <a
                href="https://github.com/avinashgurugubelli"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/avinashgurugubelli"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                LinkedIn
              </a>
              <a
                href="mailto:avinash.gurugubelli@gmail.com"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Avinash Gurugubelli. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
