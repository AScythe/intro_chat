import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NearbyUsersView, WaitingResponseView, AcceptedView } from '@/components/PeoplePageViews';
import type { SampleUserData } from '@/types/api';

const samplePerson: SampleUserData = { name: 'Alice', available: true, status: 'Ready' };
const anotherPerson: SampleUserData = { name: 'Bob', available: false, status: 'Busy' };

describe('NearbyUsersView', () => {
  it('renders room name and nearby users', () => {
    render(
      <NearbyUsersView
        roomName="Main Hall"
        nearbyUsers={[samplePerson, anotherPerson]}
        selectedPerson={null}
        onPersonClick={vi.fn()}
        onRequestChat={vi.fn()}
        onChangeRoom={vi.fn()}
      />
    );
    expect(screen.getByText('Main Hall')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows available count', () => {
    render(
      <NearbyUsersView
        roomName="Test Room"
        nearbyUsers={[samplePerson, anotherPerson]}
        selectedPerson={null}
        onPersonClick={vi.fn()}
        onRequestChat={vi.fn()}
        onChangeRoom={vi.fn()}
      />
    );
    expect(screen.getByText(/1 available/)).toBeInTheDocument();
  });

  it('disables request button when no person selected', () => {
    render(
      <NearbyUsersView
        roomName="Test"
        nearbyUsers={[samplePerson]}
        selectedPerson={null}
        onPersonClick={vi.fn()}
        onRequestChat={vi.fn()}
        onChangeRoom={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /request 2-min chat/i })).toBeDisabled();
  });

  it('enables request button when person selected', () => {
    render(
      <NearbyUsersView
        roomName="Test"
        nearbyUsers={[samplePerson]}
        selectedPerson={samplePerson}
        onPersonClick={vi.fn()}
        onRequestChat={vi.fn()}
        onChangeRoom={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /Request 2-min chat with Alice/i })).not.toBeDisabled();
  });

  it('fires onPersonClick when card clicked', () => {
    const onPersonClick = vi.fn();
    render(
      <NearbyUsersView
        roomName="Test"
        nearbyUsers={[samplePerson]}
        selectedPerson={null}
        onPersonClick={onPersonClick}
        onRequestChat={vi.fn()}
        onChangeRoom={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Alice'));
    expect(onPersonClick).toHaveBeenCalledWith(samplePerson);
  });
});

describe('WaitingResponseView', () => {
  it('renders request sent state', () => {
    const onCancel = vi.fn();
    render(<WaitingResponseView requestedPerson={samplePerson} onCancel={onCancel} />);
    expect(screen.getByText('Request Sent')).toBeInTheDocument();
    expect(screen.getByText(/Request sent/)).toBeInTheDocument();
    expect(screen.getByText(/Waiting for response/)).toBeInTheDocument();
  });

  it('fires onCancel when cancel clicked', () => {
    const onCancel = vi.fn();
    render(<WaitingResponseView requestedPerson={samplePerson} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel Request'));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});

describe('AcceptedView', () => {
  it('renders accepted state with response message', () => {
    render(
      <AcceptedView
        requestedPerson={samplePerson}
        personResponse={{ accepted: true, message: 'Happy to chat!' }}
        yourReady={false}
        theirReady={false}
        onImReady={vi.fn()}
        onGoToChat={vi.fn()}
      />
    );
    expect(screen.getByText(/Alice accepted/)).toBeInTheDocument();
    expect(screen.getByText(/Happy to chat!/)).toBeInTheDocument();
  });

  it('shows ready buttons when not ready', () => {
    render(
      <AcceptedView
        requestedPerson={samplePerson}
        personResponse={{ accepted: true, message: 'Hello!' }}
        yourReady={false}
        theirReady={false}
        onImReady={vi.fn()}
        onGoToChat={vi.fn()}
      />
    );
    expect(screen.getByText("I'm Ready to Chat!")).toBeInTheDocument();
    expect(screen.getByText('Start Chat')).toBeInTheDocument();
  });

  it('updates ready status when both ready', () => {
    render(
      <AcceptedView
        requestedPerson={samplePerson}
        personResponse={{ accepted: true, message: 'Ready!' }}
        yourReady={true}
        theirReady={true}
        onImReady={vi.fn()}
        onGoToChat={vi.fn()}
      />
    );
    expect(screen.getByText(/You: Ready!/)).toBeInTheDocument();
    expect(screen.getByText(/Alice: Ready!/)).toBeInTheDocument();
    expect(screen.getByText(/Both Ready/)).toBeInTheDocument();
  });

  it('fires onImReady when ready button clicked', () => {
    const onImReady = vi.fn();
    render(
      <AcceptedView
        requestedPerson={samplePerson}
        personResponse={{ accepted: true, message: 'Sure!' }}
        yourReady={false}
        theirReady={false}
        onImReady={onImReady}
        onGoToChat={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("I'm Ready to Chat!"));
    expect(onImReady).toHaveBeenCalledOnce();
  });

  it('disables start chat until both ready', () => {
    render(
      <AcceptedView
        requestedPerson={samplePerson}
        personResponse={{ accepted: true, message: 'Okay' }}
        yourReady={true}
        theirReady={false}
        onImReady={vi.fn()}
        onGoToChat={vi.fn()}
      />
    );
    expect(screen.getByText('Start Chat')).toBeDisabled();
  });
});
