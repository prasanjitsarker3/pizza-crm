"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  MessageCircle,
  Mail,
  FileText,
  HelpCircle,
  BookOpen,
  Video,
  ExternalLink,
  Send,
} from "lucide-react";

const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Help & Support
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Get help with your e-commerce platform. Search our documentation
              or contact support.
            </p>
            <div className="mt-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem
                  value="item-1"
                  className="rounded-lg border border-border bg-card px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    How do I add products to my store?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    To add products to your store, navigate to the Products
                    section in your admin dashboard. Click "Add Product" and
                    fill in the required information including product name,
                    description, price, images, and inventory details. Once
                    you've completed all fields, click "Publish" to make the
                    product live on your store.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-2"
                  className="rounded-lg border border-border bg-card px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    How do I process refunds?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    To process a refund, go to the Orders section and find the
                    specific order. Click on the order to view details, then
                    select "Refund" from the actions menu. You can choose to
                    refund the full amount or a partial amount. The refund will
                    be processed through the original payment method within 5-10
                    business days.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-3"
                  className="rounded-lg border border-border bg-card px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    How do I configure shipping rates?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Navigate to Settings → Shipping to configure your shipping
                    zones and rates. You can set up different rates for domestic
                    and international shipping, offer free shipping above a
                    certain order value, and integrate with shipping carriers
                    for real-time rate calculations.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-4"
                  className="rounded-lg border border-border bg-card px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    Can I customize my store's appearance?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes! Go to Settings → Appearance to customize your store's
                    theme, colors, fonts, and layout. You can upload your logo,
                    change the primary color scheme, and adjust various design
                    elements to match your brand identity.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-5"
                  className="rounded-lg border border-border bg-card px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    How do I integrate payment gateways?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    To integrate payment gateways, go to Settings → Payments. We
                    support multiple payment providers including Stripe, PayPal,
                    and more. Click "Connect" next to your preferred payment
                    gateway and follow the authentication process. Once
                    connected, you can enable or disable different payment
                    methods.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-6"
                  className="rounded-lg border border-border bg-card px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    What analytics are available?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    The platform provides comprehensive analytics including
                    sales reports, customer insights, product performance,
                    traffic sources, and conversion rates. Access the Analytics
                    dashboard to view real-time data and generate custom reports
                    for specific time periods.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Contact Support
              </h2>
              <Card className=" shadow-none">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Our support team typically responds within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue or question..."
                      rows={6}
                    />
                  </div>
                  <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>

          <div className="space-y-6">
            <Card className=" shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Live Chat
                </CardTitle>
                <CardDescription>
                  Chat with our support team in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  Start Chat
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Available Mon-Fri, 9am-5pm EST
                </p>
              </CardContent>
            </Card>

            <Card className=" shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Support
                </CardTitle>
                <CardDescription>Get help via email</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Send us an email at
                </p>
                <a
                  href="mailto:support@example.com"
                  className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  support@example.com
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            <Card className=" shadow-none">
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                >
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">Documentation</p>
                    <p className="text-xs text-muted-foreground">
                      Complete guides and tutorials
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>

                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                >
                  <Video className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">Video Tutorials</p>
                    <p className="text-xs text-muted-foreground">
                      Step-by-step video guides
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>

                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                >
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">API Reference</p>
                    <p className="text-xs text-muted-foreground">
                      Developer documentation
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>

                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                >
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">Community Forum</p>
                    <p className="text-xs text-muted-foreground">
                      Connect with other users
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>

            <Card className=" shadow-none">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">
                    All systems operational
                  </span>
                </div>
                <a
                  href="#"
                  className="mt-3 inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
                >
                  View status page
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
