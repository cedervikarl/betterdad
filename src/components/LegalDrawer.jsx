import { useEffect } from 'react'
import './LegalDrawer.css'

const DOCS = [
  { id: 'faq', title: 'FAQ' },
  { id: 'terms', title: 'Terms and Conditions of use' },
  { id: 'privacy', title: 'Privacy Policy' },
  { id: 'subscription', title: 'Subscription Policy' },
  { id: 'moneyback', title: 'Money-Back Policy' },
  { id: 'impressum', title: 'Impressum' },
  { id: 'guarantee', title: 'Legal Guarantee' },
  { id: 'edr', title: 'European Dispute Resolution' },
  { id: 'eprivacy', title: 'e-Privacy Settings' },
]

function DocSection({ title, children }) {
  return (
    <section className="legal-section">
      <h3 className="legal-section-title">{title}</h3>
      <div className="legal-section-body">{children}</div>
    </section>
  )
}

function LegalDrawer({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="legal-overlay" role="dialog" aria-modal="true" aria-label="Docs">
      <button className="legal-backdrop" onClick={onClose} aria-label="Close docs"></button>

      <div className="legal-drawer">
        <div className="legal-header">
          <div className="legal-title">Docs</div>
          <button className="legal-close" onClick={onClose} aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="legal-content">
          <nav className="legal-nav">
            {DOCS.map((d) => (
              <a key={d.id} href={`#${d.id}`} className="legal-nav-item">
                {d.title}
              </a>
            ))}
          </nav>

          <div className="legal-sections">
            <div id="faq">
              <DocSection title="FAQ">
                <p>
                  If you have questions about your plan, payments, or how the subscription works, email us and we’ll help.
                </p>
              </DocSection>
            </div>

            <div id="terms">
              <DocSection title="Terms and Conditions of use">
                <p>
                  By purchasing or using BetterDad services, you agree to our terms. The program is for informational and fitness guidance only and does not replace medical advice.
                </p>
              </DocSection>
            </div>

            <div id="privacy">
              <DocSection title="Privacy Policy">
                <p>
                  We process your data to provide and improve your personalized plan. We do not sell personal data. You can request deletion at any time.
                </p>
              </DocSection>
            </div>

            <div id="subscription">
              <DocSection title="Subscription Policy">
                <p>
                  Subscriptions renew automatically unless cancelled. You can cancel anytime; access remains until the end of your current period.
                </p>
              </DocSection>
            </div>

            <div id="moneyback">
              <DocSection title="Money-Back Policy">
                <p>
                  If you follow the plan consistently and are not satisfied with the results, contact us and we’ll review your request according to our guarantee terms.
                </p>
              </DocSection>
            </div>

            <div id="impressum">
              <DocSection title="Impressum">
                <p><strong>Company</strong>: Likeike AB</p>
                <p><strong>Address</strong>: Box 71, 193 22 Sigtuna</p>
                <p><strong>Contact</strong>: likeikeab@gmail.com</p>
              </DocSection>
            </div>

            <div id="guarantee">
              <DocSection title="Legal Guarantee">
                <p>
                  BetterDad provides a results-based guarantee described on the pricing page. Eligibility depends on following the plan consistently during your active subscription.
                </p>
              </DocSection>
            </div>

            <div id="edr">
              <DocSection title="European Dispute Resolution">
                <p>
                  If you’re a consumer in the EU, you may use the EU Online Dispute Resolution platform for complaints.
                </p>
              </DocSection>
            </div>

            <div id="eprivacy">
              <DocSection title="e-Privacy Settings">
                <p>
                  You can request changes to communication preferences by emailing us. We will update your preferences as soon as possible.
                </p>
              </DocSection>
            </div>

            <div className="legal-footer">
              <p>
                We will be glad to assist you via email. Please send your questions and feedback to{' '}
                <a className="legal-link" href="mailto:likeikeab@gmail.com">likeikeab@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LegalDrawer


