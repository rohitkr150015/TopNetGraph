import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

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
            subtitle: _('Specific interface name or "auto" for all active interfaces'),
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