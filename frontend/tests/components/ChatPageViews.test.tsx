import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorView, ChatLoadingView, ChattingView, TimeUpView, ExtendedView } from '@/components/ChatPageViews';

describe('ErrorView', () => {
  it('renders error message and back button', () => {
    const onBack = vi.fn();
    render(<ErrorView error="Something went wrong" onBack={onBack} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Back to Home'));
    expect(onBack).toHaveBeenCalledOnce();
  });
});

describe('ChatLoadingView', () => {
  it('renders loading state with duration', () => {
    render(<ChatLoadingView durationLabel="2 min" />);
    expect(screen.getByText('Setting up your chat...')).toBeInTheDocument();
    expect(screen.getByText(/2 min/)).toBeInTheDocument();
  });
});

describe('ChattingView', () => {
  it('renders partner name and prompts', () => {
    render(
      <ChattingView
        partnerName="Alice"
        prompts={['Prompt A', 'Prompt B']}
        currentPromptIndex={0}
        onNextPrompt={vi.fn()}
      />
    );
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    expect(screen.getByText('Prompt A')).toBeInTheDocument();
  });

  it('shows next prompt button and cycles prompts', () => {
    const onNextPrompt = vi.fn();
    render(
      <ChattingView
        partnerName="Bob"
        prompts={['Prompt 1', 'Prompt 2']}
        currentPromptIndex={1}
        onNextPrompt={onNextPrompt}
      />
    );
    expect(screen.getByText('Prompt 2')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next Prompt'));
    expect(onNextPrompt).toHaveBeenCalledOnce();
  });

  it('shows empty state when no prompts', () => {
    render(
      <ChattingView
        partnerName="Charlie"
        prompts={[]}
        currentPromptIndex={0}
        onNextPrompt={vi.fn()}
      />
    );
    expect(screen.getByText(/Charlie/)).toBeInTheDocument();
    expect(screen.getByText('Next Prompt')).toBeInTheDocument();
  });
});

describe('TimeUpView', () => {
  it('renders extend and end options', () => {
    const onExtend = vi.fn();
    const onEndChat = vi.fn();
    render(<TimeUpView onExtend={onExtend} onEndChat={onEndChat} />);
    expect(screen.getByText("Time's Up!")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Extend for/));
    expect(onExtend).toHaveBeenCalledWith(30);
    fireEvent.click(screen.getByText('End chat and connect'));
    expect(onEndChat).toHaveBeenCalledOnce();
  });

  it('supports indefinite extension', () => {
    const onExtend = vi.fn();
    render(<TimeUpView onExtend={onExtend} onEndChat={vi.fn()} />);
    fireEvent.click(screen.getByText('Continue indefinitely'));
    expect(onExtend).toHaveBeenCalledWith(-1);
  });
});

describe('ExtendedView', () => {
  it('shows remaining time when timer is running', () => {
    render(
      <ExtendedView
        partnerName="Alice"
        timeLeft={120}
        isRunning={true}
        onEndChat={vi.fn()}
      />
    );
    expect(screen.getByText('Extended Chat')).toBeInTheDocument();
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
  });

  it('shows no time limit message when not running', () => {
    render(
      <ExtendedView
        partnerName="Bob"
        timeLeft={0}
        isRunning={false}
        onEndChat={vi.fn()}
      />
    );
    expect(screen.getByText(/no time limit/i)).toBeInTheDocument();
  });

  it('fires onEndChat when button clicked', () => {
    const onEndChat = vi.fn();
    render(
      <ExtendedView
        partnerName="Alice"
        timeLeft={60}
        isRunning={true}
        onEndChat={onEndChat}
      />
    );
    fireEvent.click(screen.getByText('End chat and connect'));
    expect(onEndChat).toHaveBeenCalledOnce();
  });
});
