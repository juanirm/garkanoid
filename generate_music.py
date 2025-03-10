from mingus.containers import Note, Bar, Track, Composition
from mingus.midi import midi_file_out
import random

def create_space_theme():
    # Create a composition
    comp = Composition()
    
    # Base track for the main theme
    main_track = Track()
    
    # Define some space-like chord progressions (in C minor)
    progressions = [
        ["C4", "Eb4", "G4"],  # Cm
        ["G3", "Bb3", "D4"],  # Gm
        ["F3", "Ab3", "C4"],  # Fm
        ["Eb3", "G3", "Bb3"]  # Eb
    ]
    
    # Create ambient background
    for _ in range(4):  # 4 bars
        bar = Bar()
        progression = random.choice(progressions)
        
        # Add notes with different durations
        for note in progression:
            bar.place_notes(note, 2)  # Half notes
        
        main_track.add_bar(bar)
    
    # Create a second track for arpeggios
    arpeggio_track = Track()
    
    # Add some arpeggiated patterns
    for _ in range(4):
        bar = Bar()
        progression = random.choice(progressions)
        
        # Create arpeggio pattern
        for _ in range(4):  # 4 beats per bar
            for note in progression:
                bar.place_notes(note, 16)  # Sixteenth notes
        
        arpeggio_track.add_bar(bar)
    
    # Add tracks to composition
    comp.add_track(main_track)
    comp.add_track(arpeggio_track)
    
    return comp

if __name__ == "__main__":
    # Create the composition
    composition = create_space_theme()
    
    # Save as MIDI file
    midi_file_out.write_Composition("space_theme.mid", composition)
