import { useMemo, useState } from 'react'

const defaultTemplates = {
  'New Sale': {
    subject: 'Thank you for your purchase',
    body: 'Dear {customer_name}, your sale {invoice_no} of {total_amount} has been completed. Thank you for shopping with Techaiot POS.',
  },
  'Payment Received': {
    subject: 'Payment received',
    body: 'Dear {customer_name}, we have received {amount_paid} for invoice {invoice_no}. Balance due: {balance_due}.',
  },
  'Payment Reminder': {
    subject: 'Payment reminder',
    body: 'Dear {customer_name}, this is a reminder that invoice {invoice_no} has a balance of {balance_due}. Kindly arrange payment.',
  },
}

const sampleValues = {
  customer_name: 'Moses Kariuki',
  invoice_no: 'INV2026/0001',
  total_amount: 'KES 2,450.00',
  amount_paid: 'KES 1,000.00',
  balance_due: 'KES 1,450.00',
}

function renderTemplate(text) {
  return Object.entries(sampleValues).reduce((output, [key, value]) => {
    return output.replaceAll(`{${key}}`, value)
  }, text)
}

export default function NotificationTemplates({ activePage, setStatus }) {
  const [templates, setTemplates] = useState(defaultTemplates)
  const [templateForm, setTemplateForm] = useState(defaultTemplates[activePage] || defaultTemplates['New Sale'])
  const [showPreview, setShowPreview] = useState(false)

  const preview = useMemo(() => {
    return {
      subject: renderTemplate(templateForm.subject),
      body: renderTemplate(templateForm.body),
    }
  }, [templateForm])

  function saveTemplate(event) {
    event.preventDefault()

    if (!templateForm.subject.trim() || !templateForm.body.trim()) {
      setStatus('Template subject and body are required.')
      return
    }

    setTemplates((currentTemplates) => ({
      ...currentTemplates,
      [activePage]: templateForm,
    }))
    setStatus(`${activePage} template saved locally.`)
  }

  function resetTemplate() {
    const defaultTemplate = defaultTemplates[activePage] || defaultTemplates['New Sale']
    setTemplateForm(defaultTemplate)
    setShowPreview(false)
    setStatus(`${activePage} template reset to default.`)
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>{activePage}</h3>
          <span>Manage message template</span>
        </div>

        <button onClick={() => setShowPreview((open) => !open)}>
          {showPreview ? 'Hide Preview' : 'Preview'}
        </button>
      </div>

      <form className="user-form" onSubmit={saveTemplate}>
        <label>
          Subject
          <input
            value={templateForm.subject}
            onChange={(event) => setTemplateForm({ ...templateForm, subject: event.target.value })}
            required
          />
        </label>

        <label>
          Body
          <textarea
            value={templateForm.body}
            onChange={(event) => setTemplateForm({ ...templateForm, body: event.target.value })}
            rows="6"
            required
          />
        </label>

        <button type="submit">Save Template</button>
        <button type="button" onClick={resetTemplate}>Reset Default</button>
      </form>

      {showPreview && (
        <div className="users-card">
          <div className="users-card-header">
            <strong>Preview</strong>
          </div>

          <div className="home-empty-row">
            <strong>{preview.subject}</strong>
            <p>{preview.body}</p>
          </div>
        </div>
      )}

      <div className="users-card">
        <div className="users-card-header">
          <strong>Available variables</strong>
        </div>

        <div className="data-table">
          <div className="table-row header" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <span>Variable</span>
            <span>Sample Value</span>
          </div>

          {Object.entries(sampleValues).map(([key, value]) => (
            <div className="table-row" key={key} style={{ gridTemplateColumns: '1fr 1fr' }}>
              <span>{`{${key}}`}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}