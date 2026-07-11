
import { useEffect, useState } from 'react';
import '../pages/Contact.css';

type FormState = 'idle' | 'sending' | 'sent' | 'leaving';

const THANK_YOU_VISIBLE_MS = 1600;
const LEAVE_ANIM_MS = 400;

const MobileEmailForm = () => {
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

    useEffect(() => {
        if (status === 'sent') {
            const t = setTimeout(() => setStatus('leaving'), THANK_YOU_VISIBLE_MS);
            return () => clearTimeout(t);
        }
        if (status === 'leaving') {
            const t = setTimeout(() => setStatus('idle'), LEAVE_ANIM_MS);
            return () => clearTimeout(t);
        }
    }, [status]);

    const fieldsActive = status === 'idle' || status === 'sending';
    const sentActive = status === 'sent';

    return (
        <div>
            <form className={"email-form mobile-email-form "} onSubmit={handleSubmit}>
                <div className="email-form-stage">
                    <div className={"email-form-fields" + (fieldsActive ? ' active' : '')}>
                        <h2>Send us a message</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            disabled={!fieldsActive}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={!fieldsActive}
                            required
                        />
                        <textarea
                            placeholder="Message"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={3}
                            disabled={!fieldsActive}
                            required
                        />
                        <button type="submit" disabled={!fieldsActive || status === 'sending'}>
                            {status === 'sending' ? 'Sending…' : 'Send'}
                        </button>
                    </div>

                    <div className={"form-sent" + (sentActive ? ' active' : '') + (status === 'leaving' ? ' leaving' : '')}>
                        <span>✓</span>
                        <p>Thank you!</p>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default MobileEmailForm;