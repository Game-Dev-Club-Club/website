
import { useEffect, useState } from 'react';
import '../pages/Contact.css';

type FormState = 'idle' | 'sending' | 'sent' | 'leaving';

const THANK_YOU_VISIBLE_MS = 1600;
const LEAVE_ANIM_MS = 400;

const DesktopEmailForm = (props: { opened: boolean; onClose: () => void }) => {
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
            const t = setTimeout(() => props.onClose(), LEAVE_ANIM_MS);
            return () => clearTimeout(t);
        }
    }, [status]);

    // Reset back to a fresh, empty form only once the popup is opened again —
    // resetting the moment it closes would swap the "Thank you!" message back
    // to the input fields for one frame while the popup is still scaling down.
    useEffect(() => {
        if (props.opened) setStatus('idle');
    }, [props.opened]);

    return (
        <div>
            <form className={"email-form desktop-email-form " + (props.opened ? 'show' : 'hide')} onSubmit={handleSubmit}>
                <button
                    type="button"
                    className="email-form-close"
                    onClick={props.onClose}
                    aria-label="Close"
                >
                    ×
                </button>

                {status === 'sent' || status === 'leaving' ? (
                    <div className={"form-sent" + (status === 'leaving' ? ' leaving' : '')}>
                        <span>✓</span>
                        <p>Thank you!</p>
                    </div>
                ) : (
                    <div className="email-form-fields">
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
                    </div>
                )}
            </form>
        </div>
    );
}

export default DesktopEmailForm;