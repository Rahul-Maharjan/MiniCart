export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">About MiniCart</h1>
          <p className="text-xl text-slate-600">
            Your trusted online shopping destination
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Our Story</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-4">
              MiniCart was founded with a simple mission: to make online shopping accessible,
              enjoyable, and trustworthy for everyone. We believe that finding the perfect
              product shouldn't be complicated or stressful.
            </p>
            <p className="text-slate-600 mb-4">
              Our platform brings together quality products from trusted brands, offering
              competitive prices and exceptional customer service. Whether you're looking
              for the latest gadgets, fashion essentials, or home goods, we've got you covered.
            </p>
            <p className="text-slate-600">
              We're committed to providing a seamless shopping experience with fast delivery,
              secure payments, and responsive support. Join thousands of satisfied customers
              who have made MiniCart their go-to shopping destination.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Our Values</h3>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Quality First:</strong> We carefully select products from reputable brands</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Customer Focus:</strong> Your satisfaction is our top priority</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Transparency:</strong> Clear pricing and honest product descriptions</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Innovation:</strong> Constantly improving our platform and services</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Why Choose Us?</h3>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Fast and reliable shipping</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Secure payment processing</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>24/7 customer support</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Easy returns and exchanges</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-blue-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-semibold mb-4">Ready to Start Shopping?</h3>
            <p className="mb-6 opacity-90">
              Join our community of satisfied customers today.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-slate-50 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
