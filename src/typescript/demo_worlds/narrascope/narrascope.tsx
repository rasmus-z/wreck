import { createElement, story_updater, StoryQueryIndex, Updates } from '../../story';
import { gist, Gists, gists_equal, includes_tag } from '../../gist';
import { make_puffer_world_spec } from '../../puffer';
import { is_simulated } from '../../supervenience';
import { cond, included, update, map } from '../../lib/utils';
import { get_initial_world, WorldSpec, world_driver } from '../../world';
import { Actions, Facets, RenderFacet } from './metaphor';
import { Puffers, resource_registry, Venience } from './prelude';
import { find_world_at } from './supervenience_spec';
import { Topics } from './topic';
import { Memories } from './memory';
import {add_to_notes} from './notes';


interface PuzzleState {
    has_scrutinized_memory: Map<1 | 2 | 3 | 4, boolean | symbol>;
    has_chill: boolean | symbol;
    has_recognized_something_wrong: boolean | symbol;
    is_curious_about_history: boolean | symbol;
    has_admitted_negligence: boolean | symbol;
    has_unpacked_culpability: boolean | symbol;
    has_volunteered: boolean | symbol;
    end: boolean;
}

declare module './prelude' {
    export interface Venience extends PuzzleState {}

    export interface StaticResources {
        initial_world_narrascope: PuzzleState
    }
}

resource_registry.initialize('initial_world_narrascope', {
    has_chill: false,
    has_recognized_something_wrong: false,
    is_curious_about_history: false,
    has_admitted_negligence: false,
    has_unpacked_culpability: false,
    has_volunteered: false,
    end: false,

    has_scrutinized_memory: map()
});

Actions({
    name: 'to attend',
    noun: 'attention',
    noun_cmd: 'attention',
    description: "The ability to attend to particular facets of one's perception.",
    slug: 'attend',
    get_cmd: (facet) => ['attend_to', facet],
    get_wrong_msg: (facet) => <div>Merely paying more attention to {facet} does not seem to be enough.</div>
});

Memories({
    action: 'to attend',
    could_remember: world => !!world.has_considered.get('your notebook'),
    description: () => <RenderFacet name="a memory 1" />
});

function about_attentive(w: Venience) {
    return w.gist !== null && includes_tag('to attend', w.gist);
}

Facets({
    name: 'a memory 1',
    noun_phrase: "A memory.",
    slug: 'memory-1',
    noun_phrase_cmd: 'the_memory',
    can_recognize: (w2, w1) =>
        about_attentive(w1) && !!w2.has_acquired.get('to attend'),
    can_apply: (action) => true/*action.name === 'to scrutinize'*/,
    solved: w => w.has_scrutinized_memory.get(1) || false,
    handle_action: (action, world) => {
        if (action.name === 'to scrutinize') {
            return update(world, 
                { has_scrutinized_memory: map( [1, Symbol()] )},
            );
        }
        return world;
    },

    content: <div className="memory-1">
        "Wake up, my dear. Attend to the world around you."
        <blockquote className="interp-memory-1">
            Katya took you to the <a target="_blank" href="https://en.wikipedia.org/wiki/Mauna_Kea_Observatories">Mauna Kea Observatories</a> in Hawaii once, to study the astronomers at work.
            <br/>
            There was to be little time to relax or sleep in; astronomers are busy folk.
        </blockquote>
    </div>
});

function about_scrutinizing(w: Venience) {
    return w.gist !== null && includes_tag('to scrutinize', w.gist);
}

Facets({
    name: 'a memory 2',
    noun_phrase: "A memory.",
    slug: 'memory-2',
    noun_phrase_cmd: 'the_memory',
    can_recognize: (w2, w1) =>
        about_scrutinizing(w1) && !!w2.has_acquired.get('to scrutinize'),
    can_apply: (action) => action.name === 'to scrutinize',
    solved: w => w.has_scrutinized_memory.get(2) || false,
    handle_action: (action, world) => {
        if (action.name === 'to scrutinize') {
            return update(world, 
                { has_scrutinized_memory: map([2, Symbol()])},
            );
        }
        return world;
    }     
});

function about_hammer(w: Venience) {
    return w.gist !== null && includes_tag('to hammer', w.gist);
}

Facets({
    name: 'a memory 3',
    noun_phrase: "A memory.",
    slug: 'memory-3',
    noun_phrase_cmd: 'the_memory',
    can_recognize: (w2, w1) =>
        about_hammer(w1) && !!w2.has_acquired.get('to hammer'),
    can_apply: (action) => action.name === 'to scrutinize',
    solved: w => w.has_scrutinized_memory.get(3) || false,
    handle_action: (action, world) => {
        if (action.name === 'to scrutinize') {
            return update(world, 
                { has_scrutinized_memory:  map([3, Symbol()])},
            );
        }
        return world;
    }     
});

function about_volunteer(w: Venience) {
    return w.gist !== null && includes_tag('to volunteer', w.gist);
}

Facets({
    name: 'a memory 4',
    noun_phrase: "A memory.",
    slug: 'memory-4',
    noun_phrase_cmd: 'the_memory',
    can_recognize: (w2, w1) =>
        about_volunteer(w1) && !!w2.has_acquired.get('to volunteer'),
    can_apply: (action) => action.name === 'to scrutinize',
    solved: w => w.has_scrutinized_memory.get(4) || false,
    handle_action: (action, world) => {
        if (action.name === 'to scrutinize') {
            return update(world, 
                { has_scrutinized_memory: map([4, Symbol()])},
            );
        }
        return world;
    }     
});

Topics({
    name: 'Sam',
    cmd: 'sam',
    can_consider: () => true,
    message: () => Updates.description(<div className="sam">
        <div className="friendship-sam">
            An old friend on his way to work.
            <blockquote className="interp-friendship-sam">
                You realize how long it's been since you've seen him anywhere other than the bus.
            </blockquote>
        </div>
        <div className="sam-demeanor">
            He glances at you, smiling vaguely.
            <blockquote className="interp-sam-demeanor">
                Something about his smile feels... false. A lie.
                <br/>
                And his eyes. Flicking here and there. Noncommital. Nervous.
            </blockquote>
        </div>
        <div className="interp-sam affinity">
            ...Something is wrong.
            <blockquote className="interp-affinity">
                Indeed. It's time to try to do something about it.
            </blockquote>
        </div>
    </div>),
    reconsider: (w2, w1) => {
        if (w2.has_acquired.get('to attend') && !w2.has_chill) {
            return true;
        }

        if (w2.has_acquired.get('to scrutinize') && !w2.has_recognized_something_wrong) {
            return true;
        }

        if (w2.has_acquired.get('to hammer') && !w2.is_curious_about_history) {
            return true;
        }

        if (w2.has_acquired.get('to volunteer') && !w2.has_volunteered) {
            return true;
        }
        return false;
    }
});

function has_considered_notebook(world: Venience) {
    return world.has_considered.get('your notebook');
};

Topics({
    name: 'yourself',
    cmd: 'myself',
    can_consider: () => true,
    message: (world) => Updates.description(<div>
        You haven't entirely woken up.
        <br/>
        {has_considered_notebook(world)
            ? <div>Your notebook sits in your lap.</div>
            : <div>A <strong>thick notebook</strong> sits in your lap.</div>}
    </div>),
});

Topics({
    name: 'your notebook',
    cmd: 'my_notebook',
    can_consider: (world) => !!world.has_considered.get('yourself'),
    message: () => [
        Updates.description(<div>
            You keep it with you at all times.
            <br/>
            It is filled with the words of someone very wise, who you once knew.
        </div>),
        Updates.prompt(<div>
            Each day you try to <strong>remember something</strong> that she told you, and write it down.
        </div>)
    ]
});

const abtsm = gist('impression', { subject: gist('Sam') });
// Big old hack but it'll do for now
function about_sam(world: Venience) {
    return world.gist !== null && gists_equal(world.gist, abtsm);
}

Facets({
    name: 'Sam',
    noun_phrase: "Sam's presence by your side.",
    slug: 'sam',
    noun_phrase_cmd: 'sam',
    can_recognize: (w2, w1) =>
        about_sam(w1) && !!w2.has_acquired.get('to attend'),
    can_apply: (action) => true/*action.name === 'to attend'*/,
    solved: w => w.has_chill,
    handle_action: (action, world) => {
        if (action.name === 'to attend') {
            return update(world, 
                { has_chill: Symbol() },    
                story_updater(
                    Updates.consequence(cond(!world.has_chill, () => <div>A chill comes over you.</div>)),
                    Updates.description(<div>
                        Something about Sam is <i>incorrect</i>.
                        <br/>
                        You can feel the discordance in your bones. It scares you.
                    </div>)
                )
            );
        } else {
            // TODO: replace generic wrong msg with hint asking for more specifity
            if (action.name === 'to scrutinize') {
                return update(world, story_updater(Updates.consequence(<div>You'll need to be more specific about what to scrutinize.</div>)))
            }
            return update(world, story_updater(Updates.consequence(action.get_wrong_msg('sam'))));
        }
    }
});

Actions({
    name: 'to scrutinize',
    noun: 'scrunity',
    noun_cmd: 'scrutiny',
    description: "The ability to unpack details and look beyond your initial assumptions.",
    slug: 'scrutiny',
    get_cmd: (facet) => ['scrutinize', facet],
    get_wrong_msg: (facet) => <div>Despite your thorough scrutiny, {facet} remains unresolved.</div>
})

Memories({
    action: 'to scrutinize',
    could_remember: world => !!world.has_chill,
    description: () => <div className="memory-2">
        "Look beyond your initial impressions, my dear. Scrutinize. Concern yourself with nuance."
        <blockquote className="interp-memory-2">
            She mentioned this while making a point about the intricacies of the <a target="_blank" href="https://en.wikipedia.org/wiki/Observer_effect_(physics)">Observer Effect</a>.
        </blockquote>
    </div>
});

Facets({
    name: "Sam's demeanor",
    noun_phrase: "Sam's demeanor",
    slug: 'sam-demeanor',
    noun_phrase_cmd: "sam's_demeanor",
    can_recognize: (w2, w1) =>
        about_sam(w1) && !!w2.has_acquired.get('to scrutinize'),
    can_apply: (action) => true/*action.name === 'to scrutinize'*/,
    solved: w => w.has_recognized_something_wrong,
    handle_action: (action, world) => {
        if (action.name === 'to scrutinize') {
            return update(world,
                { has_recognized_something_wrong: Symbol() },
                story_updater(Updates.consequence(<div>
                    You are struck by the alarming incongruence of his demeanor.
                    <br/>
                    The initial pleasant, mild impression, revealed upon further scrutiny to be a veneer, a mask, a lie.
                </div>)));
        } else if (action.name === 'to attend') {
            return update(world,
                story_updater(Updates.consequence(`You notice nothing new about his demeanor.`)));
        } else {
            return update(world, story_updater(Updates.consequence(action.get_wrong_msg("sam's demeanor"))));
        }
    }
});

Actions({
    name: 'to hammer',
    noun: 'the hammer',
    noun_cmd: 'the_hammer',
    description: "The act of dismantling one's own previously-held beliefs.",
    slug: 'to-hammer',
    get_cmd: (facet) => ['hammer_against the_foundations_of', facet],
    get_wrong_msg: (facet) => `You find yourself unable to shake ${facet}, despite your efforts.`
});

Memories({
    action: 'to hammer',
    could_remember: world => !!world.has_recognized_something_wrong,
    description: () => <div className="memory-3">
        "Take a hammer to your assumptions, my dear. If they are ill-founded, let them crumble."
        <blockquote className="interp-memory-3">
            She always pushed you.
            <br />
            Katya was always one to revel in the overturning of wrong ideas.
        </blockquote>
    </div>
});

Facets({
    name: 'your friendship with Sam',
    slug: 'friendship-sam',
    noun_phrase_cmd: 'my_friendship_with_sam',
    noun_phrase: 'Your friendship with Sam.',

    can_recognize: (w2, w1) =>
        about_sam(w1) && !!w2.has_acquired.get('to hammer'),
    can_apply: (action) => true/*included(action.name, ['to hammer'])*/,
    solved: w => w.is_curious_about_history,
    handle_action: (action, world) => {
        if (action.name === 'to hammer') {
            return update(world,
                story_updater(
                    Updates.action([`You ask yourself a hard question: `, <i>Is Sam really your friend?</i>]),
                    Updates.consequence("You realize you don't know anymore."),
                    Updates.prompt("You'll have to <strong>consider your history</strong>.")
                ),
                { is_curious_about_history: Symbol() }
            );
        }
        return world;
    }

});

Topics({
    name: 'your history with Sam',
    cmd: 'my_history_with_Sam',
    can_consider: (w) => !!w.is_curious_about_history,
    message: () => Updates.description(<div>
        You've known Sam since you both arrived in Boston about 10 years ago.
        <br/>
        You were studying under Katya, and he was doing agricultural engineering a few buildings over.
        <div className="falling-out">
            At some point along the way, you drifted apart.
            <blockquote className="interp-falling-out culpability">
                It wasn't mutual. It was <i>you</i>.
                <blockquote className="interp-culpability">
                    After Katya left, you turned inward. Closed off.
                    <br/>
                    You stopped being curious about people like Sam.
                </blockquote>
            </blockquote>
        </div>
    </div>),
    reconsider: (w2, w1) => {
        if (!w2.has_unpacked_culpability) {
            return true;
        }
        return false;
    }
});

Gists({
    tag: 'your history with Sam',
    noun_phrase: () => 'your history with Sam',
    command_noun_phrase: () => 'my_history_with_sam'
});

function is_about_history(w: Venience) {
    return w.gist !== null && gists_equal(w.gist, gist('impression', { subject: gist('your history with Sam')}));
}

Facets({
    name: 'your drifting apart',
    slug: 'falling-out',
    noun_phrase_cmd: 'our_drifting_apart',
    noun_phrase: 'Your drifting apart.',

    can_recognize: (w2, w1) => is_about_history(w1),
    can_apply: (action) => true/*included(action.name, ['to hammer'])*/,
    solved: w => w.has_admitted_negligence,
    handle_action: (action, world) => {
        if (action.name === 'to hammer') {
            return update(world,
                { has_admitted_negligence: Symbol() },
                story_updater(Updates.consequence(<div>
                    You force yourself to look the truth in the eye: <i>You</i> bowed out of the friendship.
                    <br/>
                    There was nothing mutual about it. You sidelined him without explanation.
                </div>))
            );
        }
        return world;
    }
});

Facets({
    name: 'your culpability',
    slug: 'culpability',
    noun_phrase_cmd: 'my_culpability',
    noun_phrase: 'Your culpability.',

    can_recognize: (w2, w1) => is_about_history(w1) && !!w2.has_admitted_negligence,
    can_apply: (action) => true/*included(action.name, ['to scrutinize'])*/,
    solved: w => w.has_unpacked_culpability,
    handle_action: (action, world) => {
        if (action.name === 'to scrutinize') {
            return update(world,
                { has_unpacked_culpability: Symbol() },
                story_updater(Updates.consequence(<div>
                    There's no doubt you did it out of self-preservation.
                    <br/>
                    There's also no doubt he deserved better.
                    <br/>
                    You wince at the guilt.
                </div>))
            );
        }
        return world;
    }
});

Actions({
    name: 'to volunteer',
    noun: 'the volunteer',
    noun_cmd: 'the_volunteer',
    description: "The offering of an active intervention in the world, to change it for the better.",
    slug: 'volunteer',
    get_cmd: (facet) => ['volunteer to_foster', facet],
    get_wrong_msg: (facet) => `Despite your thorough scrutiny, ${facet} remains concerning.`
})

Memories({
    action: 'to volunteer',
    could_remember: world => !!world.has_unpacked_culpability,
    description: () => <div className="memory-4">
        "Do more than merely receive and respond, my dear. We must participate, as best as we can. We must volunteer ourselves to the world."
        <blockquote className="interp-memory-4">
            This is one of the last things she said to you, before she left.
        </blockquote>
    </div>
});

Facets({
    name: 'the old affinity',
    slug: 'affinity',
    noun_phrase_cmd: 'the_old_affinity',
    noun_phrase: 'The old affinity you once had for each other.',

    can_recognize: (w2, w1) => about_sam(w1) && !!w2.has_acquired.get('to volunteer'),
    can_apply: (action) => true/*included(action.name, ['to volunteer'])*/,
    solved: w => w.has_volunteered,
    handle_action: (action, world) => {
        if (action.name === 'to volunteer') {
            return update(world,
                { has_volunteered: Symbol(), },
                story_updater(Updates.consequence(`
                    You turn in your seat, and look him in the eyes, and say,`)));
        }
        return world;
    }
});

let global_lock = resource_registry.get('global_lock', false);
let outro_lock = global_lock('Outro');

Puffers({
    role_brand: true,
    pre: world => {
        if (world.has_volunteered) {
            return update(world, w => outro_lock.lock(w));
        }
        return world;
    },

    handle_command: (world, parser) => {
            if (!world.has_volunteered || world.end) {
                return parser.eliminate();
            }

            return parser.consume('How are you, Sam?',
                () => parser.submit(
                    () => update(world,
                        { end: true },
                        story_updater(Updates.consequence(<div>
                            <div className="interp">
                                VENIENCE WORLD
                            </div>
                            A work of <span className="blue">interactive fiction</span>
                            <br/>
                            by <div className="interp-inline">Daniel Spitz</div>
                            <br/><br/>
                            Thank you for playing the demo!
                        </div>)))));
    }
});


// Test command to beat the whole demo
// Puffers({
//     handle_command: { kind: 'Stages',
//         4: ((world, parser) => {
//             if (is_simulated('playtester', world)) {
//                 return parser.eliminate();
//             }

//             if (world.end) {
//                 return parser.eliminate();
//             }

//             return parser.consume('beat_the_game', () =>
//                 parser.submit(() => {
                
//                 return find_world_at(world.previous!, 7).result!;
//         }))})
//     }
// });

export { Venience } from './prelude';

let initial_venience_world: Venience = {
    ...get_initial_world<Venience>(),
    ...resource_registry.get('initial_world_prelude', false),
    ...resource_registry.get('initial_world_metaphor', false),
    ...resource_registry.get('initial_world_topic', false),
    ...resource_registry.get('initial_world_narrascope', false),
    ...resource_registry.get('initial_world_notes', false)
};

initial_venience_world = update(initial_venience_world,
    story_updater(Updates.description('You and Sam are sitting together on the bus.'))
);

const puffer_index = resource_registry.get('puffer_index', false);
export const venience_world_spec = make_puffer_world_spec(initial_venience_world, puffer_index.all(false));

export function new_venience_world() {
    return world_driver(venience_world_spec);
}

declare module './prelude' {
    export interface StaticResources {
        venience_world_spec: WorldSpec<Venience>;
    }
}

resource_registry.initialize('venience_world_spec', venience_world_spec);
resource_registry.seal();

StoryQueryIndex.seal();

