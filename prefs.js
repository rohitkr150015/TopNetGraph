import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';

// Try to import the new preferences system, fallback for older versions
let ExtensionPreferences, gettext;
try {
    // GNOME Shell 45+
    const prefsModule = await import('resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js');
    ExtensionPreferences = prefsModule.ExtensionPreferences;
    gettext = prefsModule.gettext;
} catch (e) {
    // Fallback for older versions
    const ExtensionUtils = imports.misc.extensionUtils;
    
    ExtensionPreferences = class ExtensionPreferences {
        constructor(metadata) {
            this.metadata = metadata;
        }
        
        getSettings() {
            return ExtensionUtils.getSettings('org.gnome.shell.extensions.topnetgraph');
        }
    };
    
    gettext = (str) => str;
}

const _ = gettext;

// For older GNOME Shell versions compatibility
function init() {
    // Nothing needed here for new format
}

// Legacy function for older versions
function fillPreferencesWindow(window) {
    if (typeof ExtensionPreferences === 'undefined') {
        // Old style preferences
        const { Adw, Gtk, Gio } = imports.gi;
        const ExtensionUtils = imports.misc.extensionUtils;
        
        const settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.topnetgraph');
        
        const page = new Adw.PreferencesPage({
            title: 'TopNetGraph',
            icon_name: 'network-wired-symbolic',
        });
        window.add(page);

        // Graph Settings Group
        const graphGroup = new Adw.PreferencesGroup({
            title: 'Graph Settings',
            description: 'Customize the appearance of the network traffic graph',
        });
        page.add(graphGroup);

        // Graph Type
        const graphTypeRow = new Adw.ComboRow({
            title: 'Graph Type',
            subtitle: 'Choose how the network traffic is displayed',
        });
        
        const graphTypeModel = new Gtk.StringList();
        graphTypeModel.append('Line Graph');
        graphTypeModel.append('Filled Areas');
        graphTypeRow.set_model(graphTypeModel);
        
        settings.bind('graph-type', graphTypeRow, 'selected', 
            Gio.SettingsBindFlags.DEFAULT);
        
        graphGroup.add(graphTypeRow);

        // Network Interface
        const interfaceRow = new Adw.EntryRow({
            title: 'Network Interface',
            text: settings.get_string('network-interface'),
        });
        
        interfaceRow.connect('changed', () => {
            settings.set_string('network-interface', interfaceRow.get_text());
        });
        
        graphGroup.add(interfaceRow);

        // Update Interval
        const intervalRow = new Adw.SpinRow({
            title: 'Update Interval (ms)',
            subtitle: 'How often to refresh the graph data',
            adjustment: new Gtk.Adjustment({
                lower: 100,
                upper: 2000,
                step_increment: 100,
                value: settings.get_int('update-interval'),
            }),
        });
        
        settings.bind('update-interval', intervalRow, 'value',
            Gio.SettingsBindFlags.DEFAULT);
        
        graphGroup.add(intervalRow);

        // Display Settings Group
        const displayGroup = new Adw.PreferencesGroup({
            title: 'Display Settings',
            description: 'Control what information is shown',
        });
        page.add(displayGroup);

        // Show Upload
        const showUploadRow = new Adw.SwitchRow({
            title: 'Show Upload Traffic',
            subtitle: 'Display upload speed in the graph',
        });
        
        settings.bind('show-upload', showUploadRow, 'active',
            Gio.SettingsBindFlags.DEFAULT);
        
        displayGroup.add(showUploadRow);

        // Show Download  
        const showDownloadRow = new Adw.SwitchRow({
            title: 'Show Download Traffic',
            subtitle: 'Display download speed in the graph',
        });
        
        settings.bind('show-download', showDownloadRow, 'active',
            Gio.SettingsBindFlags.DEFAULT);
        
        displayGroup.add(showDownloadRow);
    }
}

export default class TopNetGraphPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        
        const page = new Adw.PreferencesPage({
            title: _('TopNetGraph'),
            icon_name: 'network-wired-symbolic',
        });
        window.add(page);

        // Graph Settings Group
        const graphGroup = new Adw.PreferencesGroup({
            title: _('Graph Settings'),
            description: _('Customize the appearance of the network traffic graph'),
        });
        page.add(graphGroup);

        // Graph Type
        const graphTypeRow = new Adw.ComboRow({
            title: _('Graph Type'),
            subtitle: _('Choose how the network traffic is displayed'),
        });
        
        const graphTypeModel = new Gtk.StringList();
        graphTypeModel.append(_('Line Graph'));
        graphTypeModel.append(_('Filled Areas'));
        graphTypeRow.set_model(graphTypeModel);
        
        // Map the settings value to combo box index
        const graphType = settings.get_string('graph-type');
        graphTypeRow.set_selected(graphType === 'line' ? 0 : 1);
        
        graphTypeRow.connect('notify::selected', () => {
            const selected = graphTypeRow.get_selected();
            settings.set_string('graph-type', selected === 0 ? 'line' : 'filled');
        });
        
        graphGroup.add(graphTypeRow);

        // Network Interface
        const interfaceRow = new Adw.EntryRow({
            title: _('Network Interface'),
            text: settings.get_string('network-interface'),
        });
        
        interfaceRow.connect('changed', () => {
            settings.set_string('network-interface', interfaceRow.get_text());
        });
        
        graphGroup.add(interfaceRow);

        // Update Interval
        const intervalRow = new Adw.SpinRow({
            title: _('Update Interval (ms)'),
            subtitle: _('How often to refresh the graph data'),
            adjustment: new Gtk.Adjustment({
                lower: 100,
                upper: 2000,
                step_increment: 100,
                value: settings.get_int('update-interval'),
            }),
        });
        
        settings.bind('update-interval', intervalRow, 'value',
            Gio.SettingsBindFlags.DEFAULT);
        
        graphGroup.add(intervalRow);

        // Display Settings Group
        const displayGroup = new Adw.PreferencesGroup({
            title: _('Display Settings'),
            description: _('Control what information is shown'),
        });
        page.add(displayGroup);

        // Show Upload
        const showUploadRow = new Adw.SwitchRow({
            title: _('Show Upload Traffic'),
            subtitle: _('Display upload speed in the graph'),
        });
        
        settings.bind('show-upload', showUploadRow, 'active',
            Gio.SettingsBindFlags.DEFAULT);
        
        displayGroup.add(showUploadRow);

        // Show Download  
        const showDownloadRow = new Adw.SwitchRow({
            title: _('Show Download Traffic'),
            subtitle: _('Display download speed in the graph'),
        });
        
        settings.bind('show-download', showDownloadRow, 'active',
            Gio.SettingsBindFlags.DEFAULT);
        
        displayGroup.add(showDownloadRow);
    }
}