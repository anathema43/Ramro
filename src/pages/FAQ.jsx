import React from "react";
export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
      <div className="space-y-4">
        <div>
          <b>How does delivery work?</b>
          <p>Your order is shipped from the Himalayas within 2-5 business days.</p>
        </div>
        <div>
          <b>Can I return items?</b>
          <p>Yes! Read our <a href="/return-policy" className="text-himalaya underline">Return Policy</a>.</p>
        </div>
        <div>
          <b>How do I contact support?</b>
          <p>Email us at <a href="mailto:support@ramro.com" className="text-himalaya underline">support@ramro.com</a></p>
        </div>
      </div>
    </div>
  );
}
