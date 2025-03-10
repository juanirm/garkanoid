class BackgroundMusic {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.isPlaying = false;
        this.oscillators = [];
        this.gainNodes = [];
        this.masterGain = null;
        
        // Imperial March theme
        this.melody = [
            {note: 'G3', duration: 0.5},
            {note: 'G3', duration: 0.5},
            {note: 'G3', duration: 0.5},
            {note: 'E♭3', duration: 0.375},
            {note: 'B♭3', duration: 0.125},
            {note: 'G3', duration: 0.5},
            {note: 'E♭3', duration: 0.375},
            {note: 'B♭3', duration: 0.125},
            {note: 'G3', duration: 1},
            {note: 'D4', duration: 0.5},
            {note: 'D4', duration: 0.5},
            {note: 'D4', duration: 0.5},
            {note: 'E♭4', duration: 0.375},
            {note: 'B♭3', duration: 0.125},
            {note: 'G♭3', duration: 0.5},
            {note: 'E♭3', duration: 0.375},
            {note: 'B♭3', duration: 0.125},
            {note: 'G3', duration: 1},
        ];
        
        this.bassLine = [
            {note: 'G2', duration: 2},
            {note: 'G2', duration: 2},
            {note: 'G2', duration: 2},
            {note: 'G2', duration: 2},
        ];

        this.tempo = 70; // BPM
        this.currentNote = 0;
        this.currentBassNote = 0;
    }

    noteToFrequency(note) {
        const notes = {'C': 0, 'C#': 1, 'D♭': 1, 'D': 2, 'D#': 3, 'E♭': 3, 'E': 4, 'F': 5, 'F#': 6, 'G♭': 6, 'G': 7, 'G#': 8, 'A♭': 8, 'A': 9, 'A#': 10, 'B♭': 10, 'B': 11};
        const octave = parseInt(note.slice(-1));
        const semitone = notes[note.slice(0, -1)];
        return 440 * Math.pow(2, (octave - 4 + (semitone - 9) / 12));
    }

    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.3; // Adjust overall volume
        this.masterGain.connect(this.audioContext.destination);
        
        this.playMelody();
        this.playBassLine();
    }

    playMelody() {
        if (!this.isPlaying) return;

        const note = this.melody[this.currentNote];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(this.noteToFrequency(note.note), this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + note.duration * 60 / this.tempo);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + note.duration * 60 / this.tempo);

        this.currentNote = (this.currentNote + 1) % this.melody.length;
        setTimeout(() => this.playMelody(), note.duration * 60 / this.tempo * 1000);
    }

    playBassLine() {
        if (!this.isPlaying) return;

        const note = this.bassLine[this.currentBassNote];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(this.noteToFrequency(note.note), this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + note.duration * 60 / this.tempo);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + note.duration * 60 / this.tempo);

        this.currentBassNote = (this.currentBassNote + 1) % this.bassLine.length;
        setTimeout(() => this.playBassLine(), note.duration * 60 / this.tempo * 1000);
    }

    stop() {
        this.isPlaying = false;
        
        // Fade out
        if (this.masterGain) {
            this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
        }

        // Clean up
        setTimeout(() => {
            this.oscillators.forEach(osc => {
                try {
                    osc.stop();
                    osc.disconnect();
                } catch (e) {}
            });
            this.oscillators = [];
            this.gainNodes = [];
        }, 1000);
    }
}

export default BackgroundMusic;
