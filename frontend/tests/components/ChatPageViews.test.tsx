import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorView, ChatLoadingView, ChattingView, TimeUpView } from '@/components/ChatPageViews';

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

describe('ChattingView with initial mode', () => {
  it('shows duration text and no end chat button', () => {
    render(
      <ChattingView
        partnerName="Alice"
        prompts={['Prompt 1']}
        currentPromptIndex={0}
        onNextPrompt={vi.fn()}
      />
    );
    expect(screen.getByText(/30 seconds/)).toBeInTheDocument();
    expect(screen.queryByText('End chat and connect')).not.toBeInTheDocument();
  });
});

describe('ChattingView with timed mode', () => {
  it('shows same layout as initial chat with no end chat button', () => {
    const onEndChat = vi.fn();
    render(
      <ChattingView
        partnerName="Alice"
        prompts={['Prompt 1']}
        currentPromptIndex={0}
        onNextPrompt={vi.fn()}
        mode="timed"
        onEndChat={onEndChat}
      />
    );
    expect(screen.getByText(/30 seconds/)).toBeInTheDocument();
    expect(screen.getByText(/No pressure/)).toBeInTheDocument();
    expect(screen.queryByText('End chat and connect')).not.toBeInTheDocument();
  });
});

describe('ChattingView with indefinite mode', () => {
  it('shows indefinite message and end chat button', () => {
    const onEndChat = vi.fn();
    render(
      <ChattingView
        partnerName="Bob"
        prompts={['Prompt A']}
        currentPromptIndex={0}
        onNextPrompt={vi.fn()}
        mode="indefinite"
        onEndChat={onEndChat}
      />
    );
    expect(screen.getByText(/indefinite time/i)).toBeInTheDocument();
    expect(screen.getByText(/No pressure/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('End chat and connect'));
    expect(onEndChat).toHaveBeenCalledOnce();
  });
});
