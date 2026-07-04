
import { useRef, useState, useEffect } from 'react';
import '../pages/Contact.css';

type FormState = 'idle' | 'sending' | 'sent';
const EmailForm = (props: { opened: boolean }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<FormState>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('sent');
            setName('');
            setEmail('');
            setMessage('');
        }, 1000);
    };

    if (status === 'sent') {
        return (
            <div className="form-sent">
                <span>✓</span>
                <p>Message sent!</p>
            </div>
        );
    }

    return (
        <div>
            <form className={"email-form " + (props.opened ? 'show' : 'hide')} onSubmit={handleSubmit}>
                <h2>Send us a message</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={3}
                    required
                />
                <button type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send'}
                </button>
            </form>
        </div>
    );
}

export default EmailForm;