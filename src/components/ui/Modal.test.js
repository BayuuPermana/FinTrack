
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Modal from './Modal';
import '@testing-library/jest-dom';

describe('Modal Component', () => {
    test('renders correctly when open', () => {
        const onClose = jest.fn();
        render(
            <Modal isOpen={true} onClose={onClose} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );

        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    test('does not render when closed', () => {
        const onClose = jest.fn();
        render(
            <Modal isOpen={false} onClose={onClose} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );

        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', () => {
        const onClose = jest.fn();
        render(
            <Modal isOpen={true} onClose={onClose} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );

        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('close button has aria-label', () => {
        const onClose = jest.fn();
        render(
            <Modal isOpen={true} onClose={onClose} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );

        const closeButton = screen.getByRole('button', { name: /close modal/i });
        expect(closeButton).toBeInTheDocument();
    });

    test('calls onClose when Escape key is pressed', () => {
        const onClose = jest.fn();
        render(
            <Modal isOpen={true} onClose={onClose} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );

        fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
